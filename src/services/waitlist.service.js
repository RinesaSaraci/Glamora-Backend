const prisma = require("../lib/prisma");

const joinWaitlist = async (customerId, salonId, data) => {
  return await prisma.waitlist.create({
    data: {
      customerId: Number(customerId),
      salonId: Number(salonId),
      employeeId: Number(data.employeeId),
      serviceId: Number(data.serviceId),
      date: new Date(`${data.date}T00:00:00.000Z`),
      status: "WAITING",
    },
  });
};

const getWaitlistBySalon = async (salonId) => {
  return await prisma.waitlist.findMany({
    where: { salonId: Number(salonId) },
    include: {
      customer: { select: { id: true, name: true, email: true } },
      employee: { select: { id: true, name: true } },
      service: { select: { id: true, name: true, duration: true } },
    },
    orderBy: { createdAt: "asc" },
  });
};

const getCustomerWaitlist = async (customerId) => {
  return await prisma.waitlist.findMany({
    where: { customerId: Number(customerId) },
    include: {
      salon: { select: { id: true, name: true, city: true } },
      employee: { select: { id: true, name: true } },
      service: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  });
};

const updateWaitlistStatus = async (id, status) => {
  return await prisma.waitlist.update({
    where: { id: Number(id) },
    data: { status },
  });
};

module.exports = {
  joinWaitlist,
  getWaitlistBySalon,
  getCustomerWaitlist,
  updateWaitlistStatus,
};
