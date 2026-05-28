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

module.exports = {
  createReservation
};
