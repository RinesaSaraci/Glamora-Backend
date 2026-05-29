const prisma = require("../lib/prisma");

const createPromotion = async (salonId, data) => {
  return await prisma.promotion.create({
    data: {
      salonId: Number(salonId),
      title: data.title,
      description: data.description,
      discountType: data.discountType,
      discountValue: Number(data.discountValue),
      code: data.code || null,
      validFrom: new Date(data.validFrom),
      validTo: new Date(data.validTo),
      isActive: data.isActive ?? true,
    },
  });
};

const getPromotionsBySalon = async (salonId) => {
  return await prisma.promotion.findMany({
    where: { salonId: Number(salonId) },
    orderBy: { validFrom: "desc" },
  });
};

const getPromotionById = async (id) => {
  return await prisma.promotion.findUnique({ where: { id: Number(id) } });
};

const validatePromotion = async (code) => {
  const promotion = await prisma.promotion.findUnique({ where: { code } });
  if (!promotion) throw new Error("Promotion code not found");
  if (!promotion.isActive) throw new Error("Promotion is not active");

  const now = new Date();
  if (now < promotion.validFrom || now > promotion.validTo)
    throw new Error("Promotion is expired or not yet valid");

  return promotion;
};

const updatePromotion = async (id, data) => {
  return await prisma.promotion.update({
    where: { id: Number(id) },
    data: {
      title: data.title,
      description: data.description,
      discountType: data.discountType,
      discountValue: data.discountValue ? Number(data.discountValue) : undefined,
      code: data.code,
      validFrom: data.validFrom ? new Date(data.validFrom) : undefined,
      validTo: data.validTo ? new Date(data.validTo) : undefined,
      isActive: data.isActive,
    },
  });
};

const deletePromotion = async (id) => {
  await prisma.promotion.delete({ where: { id: Number(id) } });
  return { message: "Promotion deleted" };
};

module.exports = {
  createPromotion,
  getPromotionsBySalon,
  getPromotionById,
  validatePromotion,
  updatePromotion,
  deletePromotion,
};
