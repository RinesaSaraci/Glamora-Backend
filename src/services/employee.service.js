const prisma = require("../lib/prisma");

// CREATE EMPLOYEE
const createEmployee = async (salonId, data) => {
  return await prisma.employee.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      salonId: Number(salonId),
    },
  });
};

// GET ALL EMPLOYEES FOR A SALON
const getEmployeesBySalon = async (salonId) => {
  return await prisma.employee.findMany({
    where: { salonId: Number(salonId) },
    include: {
      services: {
        include: {
          service: true,
        },
      },
    },
  });
};

// GET EMPLOYEE BY ID
const getEmployeeById = async (id) => {
  return await prisma.employee.findUnique({
    where: { id: Number(id) },
    include: {
      services: {
        include: {
          service: true,
        },
      },
    },
  });
};

// UPDATE EMPLOYEE
const updateEmployee = async (id, data) => {
  return await prisma.employee.update({
    where: { id: Number(id) },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.email && { email: data.email }),
      ...(data.phone !== undefined && { phone: data.phone }),
    },
  });
};

// DELETE EMPLOYEE
const deleteEmployee = async (id) => {
  await prisma.employee.delete({
    where: { id: Number(id) },
  });
  return { message: "Employee deleted successfully" };
};

// ASSIGN SERVICES TO EMPLOYEE (Bulk Sync)
const assignServicesToEmployee = async (employeeId, serviceIds) => {
  // Step 1: Remove all existing service assignments for this employee
  await prisma.employeeService.deleteMany({
    where: { employeeId: Number(employeeId) },
  });

  // Step 2: Create new assignments in bulk
  await prisma.employeeService.createMany({
    data: serviceIds.map((id) => ({
      employeeId: Number(employeeId),
      serviceId: Number(id),
    })),
  });

  return { message: "Employee service qualifications updated successfully" };
};

module.exports = {
  createEmployee,
  getEmployeesBySalon,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  assignServicesToEmployee,
};
