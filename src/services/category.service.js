const prisma = require("../lib/prisma");

const createCategory = async (salonId, data) => {
  return await prisma.category.create({
    data: {
      name: data.name,
      description: data.description,
      salonId: Number(salonId),
    },
  });
};

const getCategoriesBySalon = async (salonId) => {
  return await prisma.category.findMany({
    where: { salonId: Number(salonId) },
    include: {
      services: { select: { id: true, name: true, price: true, duration: true } },
    },
  });
};

const getCategoryById = async (salonId, id) => {
  return await prisma.category.findFirst({
    where: { id: Number(id), salonId: Number(salonId) },
    include: { services: true },
  });
};

const updateCategory = async (id, data) => {
  return await prisma.category.update({
    where: { id: Number(id) },
    data: { name: data.name, description: data.description },
  });
};

const deleteCategory = async (id) => {
  await prisma.category.delete({ where: { id: Number(id) } });
  return { message: "Category deleted" };
};

module.exports = {
  createCategory,
  getCategoriesBySalon,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
