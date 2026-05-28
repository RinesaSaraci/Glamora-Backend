const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// CREATE RESERVATION WITH SIMPLIFIED CONFLICT CHECK
const createReservation = async (salonId, customerId, data) => {
  const targetDate = new Date(`${data.date}T00:00:00.000Z`);
  if (isNaN(targetDate.getTime())) {
    throw new Error("Invalid date format. Use YYYY-MM-DD");
  }

  // 1. Verify that the service exists
  const service = await prisma.service.findUnique({
    where: { id: Number(data.serviceId) }
  });
  if (!service) {
    throw new Error("Service not found");
  }

  // 2. Verify that the employee is qualified for this service
  const qualification = await prisma.employeeService.findFirst({
    where: {
      employeeId: Number(data.employeeId),
      serviceId: Number(data.serviceId)
    }
  });
  if (!qualification) {
    throw new Error("Employee is not qualified to perform this service");
  }

  // 3. Verify that the employee is scheduled to work on this day of the week
  const dayOfWeek = targetDate.getUTCDay();
  const schedule = await prisma.workingHour.findFirst({
    where: {
      employeeId: Number(data.employeeId),
      dayOfWeek: dayOfWeek
    }
  });
  if (!schedule) {
    throw new Error("Employee is not working on this day");
  }

  // 4. Calculate dynamic endTime based on startTime and service.duration
  const [startHours, startMinutes] = data.startTime.split(":").map(Number);
  const totalStartMinutes = startHours * 60 + startMinutes;
  const totalEndMinutes = totalStartMinutes + service.duration;
  
  const endHours = Math.floor(totalEndMinutes / 60) % 24;
  const endMins = totalEndMinutes % 60;
  const calculatedEndTime = `${endHours.toString().padStart(2, "0")}:${endMins.toString().padStart(2, "0")}`;

  // 4b. Verify booking fits within scheduled working hours
  const [schedStartH, schedStartM] = schedule.startTime.split(":").map(Number);
  const schedStartMin = schedStartH * 60 + schedStartM;

  const [schedEndH, schedEndM] = schedule.endTime.split(":").map(Number);
  const schedEndMin = schedEndH * 60 + schedEndM;

  if (totalStartMinutes < schedStartMin || totalEndMinutes > schedEndMin) {
    throw new Error(`Booking must be within employee shift hours: ${schedule.startTime} - ${schedule.endTime}`);
  }

  // 5. SIMPLE CONFLICT CHECK: Verify if there is already an active booking at the same startTime
  const existingConflict = await prisma.reservation.findFirst({
    where: {
      employeeId: Number(data.employeeId),
      date: targetDate,
      startTime: data.startTime,
      status: {
        not: "CANCELLED"
      }
    }
  });

  if (existingConflict) {
    throw new Error("This time slot is already booked for this employee");
  }

  // 6. Save the reservation
  return await prisma.reservation.create({
    data: {
      salonId: Number(salonId),
      customerId: Number(customerId),
      employeeId: Number(data.employeeId),
      serviceId: Number(data.serviceId),
      date: targetDate,
      startTime: data.startTime,
      endTime: calculatedEndTime,
      status: "PENDING"
    }
  });
};

// GET ALL RESERVATIONS FOR A SALON
const getSalonReservations = async (salonId) => {
  return await prisma.reservation.findMany({
    where: { salonId: Number(salonId) },
    include: {
      customer: { select: { id: true, name: true, email: true } },
      employee: { select: { id: true, name: true } },
      service: { select: { id: true, name: true, price: true } }
    },
    orderBy: [
      { date: "desc" },
      { startTime: "asc" }
    ]
  });
};

// GET ALL RESERVATIONS FOR A CUSTOMER
const getCustomerReservations = async (customerId) => {
  return await prisma.reservation.findMany({
    where: { customerId: Number(customerId) },
    include: {
      salon: { select: { id: true, name: true, city: true } },
      employee: { select: { id: true, name: true } },
      service: { select: { id: true, name: true, price: true } }
    },
    orderBy: [
      { date: "desc" },
      { startTime: "asc" }
    ]
  });
};

// UPDATE RESERVATION STATUS WITH SECURITY CHECKS
const updateReservationStatus = async (reservationId, newStatus, userId, userRole) => {
  // Fetch reservation and include salon details to check salon ownerId
  const reservation = await prisma.reservation.findUnique({
    where: { id: Number(reservationId) },
    include: { salon: true }
  });

  if (!reservation) {
    throw new Error("Reservation not found");
  }

  const isSalonOwner = reservation.salon.ownerId === Number(userId);
  const isCustomer = reservation.customerId === Number(userId);
  const isAdmin = userRole === "ADMIN";

  // 1. Authorization check: must be admin, salon owner, or the customer who booked it
  if (!isAdmin && !isSalonOwner && !isCustomer) {
    throw new Error("Forbidden - You do not have access to this reservation");
  }

  // 2. Client restriction: Clients can only CANCEL their own reservation
  if (!isAdmin && !isSalonOwner && isCustomer) {
    if (newStatus !== "CANCELLED") {
      throw new Error("Clients are only authorized to cancel their reservations");
    }
  }

  return await prisma.reservation.update({
    where: { id: Number(reservationId) },
    data: { status: newStatus }
  });
};

module.exports = {
  createReservation,
  getSalonReservations,
  getCustomerReservations,
  updateReservationStatus
};
