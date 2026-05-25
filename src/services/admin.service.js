const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

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
 * GET ALL USERS (opsionale)
 */
const getAllUsers = async () => {
  return await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });
};

module.exports = {
  deleteUser,
  getAllUsers,
};