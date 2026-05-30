const prisma = require("../lib/prisma");

/**
 * DELETE USER
 */
const deleteUser = async (id, callerRole) => {
  const target = await prisma.user.findUnique({ where: { id: Number(id) } });
  if (!target) throw new Error("User not found");

  if (target.role === "SUPERADMIN" && callerRole !== "SUPERADMIN") {
    throw new Error("Nuk keni qasje për të fshirë këtë përdorues.");
  }

  const ownedSalons = await prisma.salon.count({ where: { ownerId: Number(id) } });
  if (ownedSalons > 0) {
    throw new Error("Ky përdorues zotëron salone. Fshi ose ricakto salonet fillimisht.");
  }

  await prisma.user.delete({ where: { id: Number(id) } });
  return { message: "User deleted" };
};

/**
 * GET ALL USERS
 */
const getAllUsers = async () => {
  return await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      tenantId: true,
      tenant: { select: { id: true, name: true } },
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

const updateUser = async (id, data) => {
  const user = await prisma.user.findUnique({ where: { id: Number(id) } });
  if (!user) throw new Error("User not found");

  return await prisma.user.update({
    where: { id: Number(id) },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.role && { role: data.role }),
      ...(data.tenantId !== undefined && { tenantId: data.tenantId ? Number(data.tenantId) : null }),
    },
    select: { id: true, name: true, email: true, role: true, tenantId: true },
  });
};

module.exports = {
  deleteUser,
  getAllUsers,
  updateUser,
};