const prisma = require("../lib/prisma");

/**
 * DELETE USER
 */
const deleteUser = async (id) => {
  await prisma.user.delete({
    where: { id: Number(id) },
  });

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
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

module.exports = {
  deleteUser,
  getAllUsers,
};