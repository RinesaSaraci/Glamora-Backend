const prisma = require("../lib/prisma");

const createProduct = async (salonId, data) => {
  return await prisma.product.create({
    data: {
      salonId: Number(salonId),
      name: data.name,
      description: data.description,
      price: Number(data.price),
      stock: Number(data.stock ?? 0),
    },
  });
};

const getProductsBySalon = async (salonId) => {
  return await prisma.product.findMany({
    where: { salonId: Number(salonId) },
    orderBy: { name: "asc" },
  });
};

const getProductById = async (salonId, id) => {
  return await prisma.product.findFirst({
    where: { id: Number(id), salonId: Number(salonId) },
  });
};

const updateProduct = async (id, data) => {
  return await prisma.product.update({
    where: { id: Number(id) },
    data: {
      name: data.name,
      description: data.description,
      price: data.price ? Number(data.price) : undefined,
      stock: data.stock !== undefined ? Number(data.stock) : undefined,
    },
  });
};

const deleteProduct = async (id) => {
  await prisma.product.delete({ where: { id: Number(id) } });
  return { message: "Product deleted" };
};

module.exports = {
  createProduct,
  getProductsBySalon,
  getProductById,
  updateProduct,
  deleteProduct,
};
