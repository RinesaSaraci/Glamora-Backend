const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

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

// GET SERVICE BY ID
const getServiceById = async (id) => {
  return await prisma.service.findUnique({
    where: {
      id: Number(id),
    },
  });
};

// UPDATE SERVICE
const updateService = async (id, data) => {
  return await prisma.service.update({
    where: {
      id: Number(id),
    },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.duration && { duration: Number(data.duration) }),
      ...(data.price !== undefined && { price: Number(data.price) }),
    },
  });
};

// DELETE SERVICE
const deleteService = async (id) => {
  await prisma.service.delete({
    where: {
      id: Number(id),
    },
  });
  return { message: "Service deleted successfully" };
};

module.exports = {
  createService,
  getServicesBySalon,
  getServiceById,
  updateService,
  deleteService,
};
