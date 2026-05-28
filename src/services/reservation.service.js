const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// CREATE RESERVATION
const createReservation = async (salonId, customerId, data) => {
  const targetDate = new Date(`${data.date}T00:00:00.000Z`);
  if (isNaN(targetDate.getTime())) {
    throw new Error("Invalid date format. Use YYYY-MM-DD");
  }

  // 1. Fetch service details
  const service = await prisma.service.findUnique({
    where: { id: Number(data.serviceId) }
  });
  if (!service) {
    throw new Error("Service not found");
  }

  // 2. Verify employee's qualification for this service
  const qualification = await prisma.employeeService.findUnique({
    where: {
      employeeId_serviceId: {
        employeeId: Number(data.employeeId),
        serviceId: Number(data.serviceId)
      }
    }
  });
  if (!qualification) {
    throw new Error("This employee is not qualified for the requested service");
  }

  // 3. Verify employee is scheduled to work on this day of the week
  const dayOfWeek = targetDate.getUTCDay();
  const schedule = await prisma.workingHour.findFirst({
    where: {
      employeeId: Number(data.employeeId),
      dayOfWeek: dayOfWeek
    }
  });
  if (!schedule) {
    throw new Error("Employee does not work on this day of the week");
  }

  // Verify startTime fits within scheduled shift boundaries
  const timeToMinutes = (t) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };

  const startMin = timeToMinutes(data.startTime);
  const shiftStartMin = timeToMinutes(schedule.startTime);
  const shiftEndMin = timeToMinutes(schedule.endTime);

  if (startMin < shiftStartMin || startMin >= shiftEndMin) {
    throw new Error("Requested start time is outside of employee working hours");
  }

  // 4. Calculate dynamic endTime (startTime + service.duration)
  const endMinTotal = startMin + service.duration;
  if (endMinTotal > shiftEndMin) {
    throw new Error("Appointment duration exceeds employee working hours shift");
  }

  const endH = Math.floor(endMinTotal / 60) % 24;
  const endM = endMinTotal % 60;
  const endTime = `${endH.toString().padStart(2, "0")}:${endM.toString().padStart(2, "0")}`;

  // 5. Sequential Conflict Check: check for existing active bookings for this employee/time/date
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
    throw new Error("Time slot already booked for this employee");
  }

  // 6. Create the reservation record
  return await prisma.reservation.create({
    data: {
      salonId: Number(salonId),
      customerId: Number(customerId),
      employeeId: Number(data.employeeId),
      serviceId: Number(data.serviceId),
      date: targetDate,
      startTime: data.startTime,
      endTime: endTime,
      status: "PENDING"
    }
  });
};

module.exports = {
  createReservation
};
