const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// CREATE SALON
const createSalon = async (data, userId) => {
  return await prisma.salon.create({
    data: {
      name: data.name,
      description: data.description,
      city: data.city,
      ownerId: userId,
    },
  });
};

// GET ALL SALONS
const getAllSalons = async (query) => {
  return await prisma.salon.findMany({
    where: {
      ...(query?.search && {
        OR: [
          {
            name: {
              contains: query.search,
              mode: "insensitive",
            },
          },
          {
            city: {
              contains: query.search,
              mode: "insensitive",
            },
          },
        ],
      }),

      ...(query?.city && {
        city: {
          contains: query.city,
          mode: "insensitive",
        },
      }),
    },
    include: {
      owner: {
        select: { id: true, name: true, email: true },
      },
    },
  });
};

// GET SALON BY ID
const getSalonById = async (id) => {
  return await prisma.salon.findUnique({
    where: {
      id: Number(id),
    },
  });
};

// UPDATE SALON
const updateSalon = async (id, data, user) => {
  const salon = await prisma.salon.findUnique({
    where: { id: Number(id) },
  });
  if (!salon) throw new Error("Salon not found");

  if (user.role !== "ADMIN" && salon.ownerId !== user.id) {
    throw new Error("Forbidden");
  }
  return await prisma.salon.update({
    where: { id: Number(id) },
    data,
  });
};

// DELETE SALON
const deleteSalon = async (id, user) => {
  const salon = await prisma.salon.findUnique({
    where: { id: Number(id) },
  });
  if (!salon) throw new Error("Salon not found");
  if (user.role !== "ADMIN" && salon.ownerId !== user.id) {
    throw new Error("Forbidden");
  }
  await prisma.salon.delete({
    where: { id: Number(id) },
  });
  return { message: "Salon deleted" };
};

module.exports = {
  createSalon,
  getAllSalons,
  getSalonById,
  updateSalon,
  deleteSalon,
};