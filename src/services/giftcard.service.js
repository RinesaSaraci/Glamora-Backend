const prisma = require("../lib/prisma");

const generateCode = () =>
  Math.random().toString(36).substring(2, 10).toUpperCase();

const createGiftCard = async (salonId, data) => {
  const code = data.code || generateCode();
  return await prisma.giftCard.create({
    data: {
      salonId: Number(salonId),
      code,
      value: Number(data.value),
      remainingValue: Number(data.value),
      issuedToId: data.issuedToId ? Number(data.issuedToId) : null,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
    },
  });
};

const getGiftCardsBySalon = async (salonId) => {
  return await prisma.giftCard.findMany({
    where: { salonId: Number(salonId) },
    include: {
      issuedTo: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });
};

const validateGiftCard = async (code) => {
  const card = await prisma.giftCard.findUnique({ where: { code } });
  if (!card) throw new Error("Gift card not found");
  if (card.remainingValue <= 0) throw new Error("Gift card has no remaining value");
  if (card.expiresAt && new Date() > card.expiresAt)
    throw new Error("Gift card has expired");

  return card;
};

const useGiftCard = async (code, amount) => {
  const card = await validateGiftCard(code);
  const deduct = Math.min(Number(amount), card.remainingValue);

  return await prisma.giftCard.update({
    where: { code },
    data: {
      remainingValue: card.remainingValue - deduct,
      usedAt: new Date(),
    },
  });
};

module.exports = {
  createGiftCard,
  getGiftCardsBySalon,
  validateGiftCard,
  useGiftCard,
};
