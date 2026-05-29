const prisma = require("../lib/prisma");

// SET WEEKLY SCHEDULES (Bulk Sync)
const setSchedules = async (employeeId, salonId, schedulesData) => {
  // Step 1: Wipe all current schedule configuration for this employee
  await prisma.workingHour.deleteMany({
    where: { employeeId: Number(employeeId) }
  });

  // Step 2: Create new schedules in bulk
  const dataToInsert = schedulesData.map(item => ({
    employeeId: Number(employeeId),
    salonId: Number(salonId),
    dayOfWeek: Number(item.dayOfWeek),
    startTime: item.startTime,
    endTime: item.endTime
  }));

  await prisma.workingHour.createMany({
    data: dataToInsert
  });

  return { message: "Weekly schedules synced successfully" };
};

// GET EMPLOYEE SCHEDULES
const getEmployeeSchedules = async (employeeId) => {
  return await prisma.workingHour.findMany({
    where: { employeeId: Number(employeeId) },
    orderBy: { dayOfWeek: "asc" }
  });
};

module.exports = {
  setSchedules,
  getEmployeeSchedules
};
