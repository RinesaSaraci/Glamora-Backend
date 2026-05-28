const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getAvailableSlots = async (employeeId, dateString) => {
  // Normalize the query date to Midnight UTC
  const targetDate = new Date(`${dateString}T00:00:00.000Z`);
  if (isNaN(targetDate.getTime())) {
    throw new Error("Invalid date format. Use YYYY-MM-DD");
  }

  // Get the day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  const dayOfWeek = targetDate.getUTCDay();

  // Step 1: Find employee's working hours for this specific day of the week
  const schedule = await prisma.workingHour.findFirst({
    where: {
      employeeId: Number(employeeId),
      dayOfWeek: dayOfWeek
    }
  });

  // If no schedule exists, they aren't working today
  if (!schedule) {
    return [];
  }

  // Step 2: Fetch all active (non-cancelled) reservations for this employee on this date
  const reservations = await prisma.reservation.findMany({
    where: {
      employeeId: Number(employeeId),
      date: targetDate,
      status: {
        not: "CANCELLED"
      }
    }
  });

  // Extract already booked starting times (e.g., ["10:00", "14:00"])
  const bookedTimes = reservations.map(r => r.startTime);

  // Step 3: Generate simple hourly slots from schedule.startTime to schedule.endTime
  const slots = [];
  const startHour = parseInt(schedule.startTime.split(":")[0]);
  const endHour = parseInt(schedule.endTime.split(":")[0]);

  for (let hour = startHour; hour < endHour; hour++) {
    // Format hour to HH:00 (e.g. "09:00", "10:00")
    const formattedHour = hour.toString().padStart(2, "0") + ":00";
    
    // Step 4: Add slot if it is not already booked
    if (!bookedTimes.includes(formattedHour)) {
      slots.push(formattedHour);
    }
  }

  return slots;
};

module.exports = {
  getAvailableSlots
};
