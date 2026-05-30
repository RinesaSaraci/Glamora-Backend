const prisma = require("../lib/prisma");
const cache = require("../lib/cache");

// CREATE SALON
// ownerId defaults to the creator (ADMIN). Pass data.ownerId to assign an OWNER user.
const createSalon = async (data, userId) => {
  const salon = await prisma.salon.create({
    data: {
      name: data.name,
      description: data.description,
      city: data.city,
      ownerId: data.ownerId ? Number(data.ownerId) : userId,
      ...(data.tenantId && { tenantId: Number(data.tenantId) }),
    },
  });
  await cache.del("glamora:salons:all");
  return salon;
};

// GET ALL SALONS
// Pass tenantId to restrict results to a single tenant.
// SUPERADMIN (tenantId === null) receives all salons unfiltered.
const getAllSalons = async (query, tenantId = null) => {
  const hasFilters = query?.search || query?.city || tenantId;
  const cacheKey = "glamora:salons:all";

  if (!hasFilters) {
    const cached = await cache.get(cacheKey);
    if (cached) return cached;
  }

  const result = await prisma.salon.findMany({
    where: {
      ...(tenantId && { tenantId: Number(tenantId) }),
      ...(query?.search && {
        OR: [
          { name: { contains: query.search, mode: "insensitive" } },
          { city: { contains: query.search, mode: "insensitive" } },
        ],
      }),
      ...(query?.city && {
        city: { contains: query.city, mode: "insensitive" },
      }),
    },
    include: {
      owner: { select: { id: true, name: true, email: true } },
    },
  });

  if (!hasFilters) await cache.set(cacheKey, result, 60);
  return result;
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

  const canEdit =
    user.role === "SUPERADMIN" ||
    user.role === "ADMIN" ||
    salon.ownerId === user.id;
  if (!canEdit) throw new Error("Forbidden");

  const updated = await prisma.salon.update({
    where: { id: Number(id) },
    data,
  });
  await cache.del("glamora:salons:all");
  return updated;
};

// DELETE SALON
const deleteSalon = async (id, user) => {
  const salon = await prisma.salon.findUnique({
    where: { id: Number(id) },
  });
  if (!salon) throw new Error("Salon not found");

  const canDelete =
    user.role === "SUPERADMIN" ||
    user.role === "ADMIN" ||
    salon.ownerId === user.id;
  if (!canDelete) throw new Error("Forbidden");

  await prisma.salon.delete({ where: { id: Number(id) } });
  await cache.del("glamora:salons:all");
  return { message: "Salon deleted" };
};

module.exports = {
  createSalon,
  getAllSalons,
  getSalonById,
  updateSalon,
  deleteSalon,
};