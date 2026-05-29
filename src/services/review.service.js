const prisma = require("../lib/prisma");

const createReview = async (customerId, salonId, reservationId, data) => {
  const reservation = await prisma.reservation.findUnique({
    where: { id: Number(reservationId) },
  });

  if (!reservation) throw new Error("Reservation not found");
  if (reservation.customerId !== Number(customerId))
    throw new Error("Forbidden - This is not your reservation");
  if (reservation.status !== "COMPLETED")
    throw new Error("You can only review completed reservations");

  const existing = await prisma.review.findUnique({
    where: { reservationId: Number(reservationId) },
  });
  if (existing) throw new Error("You have already reviewed this reservation");

  if (data.rating < 1 || data.rating > 5)
    throw new Error("Rating must be between 1 and 5");

  return await prisma.review.create({
    data: {
      rating: Number(data.rating),
      comment: data.comment,
      customerId: Number(customerId),
      salonId: Number(salonId),
      employeeId: reservation.employeeId,
      reservationId: Number(reservationId),
    },
  });
};

const getReviewsBySalon = async (salonId) => {
  return await prisma.review.findMany({
    where: { salonId: Number(salonId) },
    include: {
      customer: { select: { id: true, name: true } },
      employee: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  });
};

const getReviewsByEmployee = async (employeeId) => {
  return await prisma.review.findMany({
    where: { employeeId: Number(employeeId) },
    include: {
      customer: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  });
};

module.exports = { createReview, getReviewsBySalon, getReviewsByEmployee };
