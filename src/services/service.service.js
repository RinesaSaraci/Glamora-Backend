const prisma = require("../lib/prisma");

// CREATE SERVICE
const createService = async (salonId, data) => {
  return await prisma.service.create({
    data: {
      name: data.name,
      description: data.description,
      duration: Number(data.duration),
      price: Number(data.price),
      salonId: Number(salonId),
    },
  });
};

// GET ALL SERVICES FOR A SALON
const getServicesBySalon = async (salonId) => {
  return await prisma.service.findMany({
    where: {
      salonId: Number(salonId),
    },
  });
};

// GET SERVICE BY ID — scoped to salon to prevent cross-tenant reads
const getServiceById = async (salonId, id) => {
  return await prisma.service.findFirst({
    where: {
      id: Number(id),
      salonId: Number(salonId),
    },
  });
};

// UPDATE SERVICE — verify service belongs to this salon before mutating
const updateService = async (salonId, id, data) => {
  const existing = await prisma.service.findFirst({
    where: { id: Number(id), salonId: Number(salonId) },
  });
  if (!existing) throw new Error("Service not found in this salon");

  return await prisma.service.update({
    where: { id: Number(id) },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.duration && { duration: Number(data.duration) }),
      ...(data.price !== undefined && { price: Number(data.price) }),
    },
  });
};

// DELETE SERVICE — verify service belongs to this salon before mutating
const deleteService = async (salonId, id) => {
  const existing = await prisma.service.findFirst({
    where: { id: Number(id), salonId: Number(salonId) },
  });
  if (!existing) throw new Error("Service not found in this salon");

  await prisma.service.delete({ where: { id: Number(id) } });
  return { message: "Service deleted successfully" };
};

module.exports = {
  createService,
  getServicesBySalon,
  getServiceById,
  updateService,
  deleteService,
};
