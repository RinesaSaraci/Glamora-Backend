const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const { generateToken } = require("../utils/jwt");
const prisma = new PrismaClient();


/**
 * REGISTER USER
 * - ADMIN vetëm nëse email përfundon me @glamora.com
 */
const register = async (data) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);
const email = data.email.trim().toLowerCase();
  // 🔐 ROLE LOGIC
  let role = "USER";
  if (email.endsWith("@glamora.com")) {
    role = "ADMIN";
  }
  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: email,
      password: hashedPassword,
      role: role,
    },
  });
  // mos e kthe password
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

/**
 * LOGIN USER
 */
const login = async (email, password) => {
 const cleanEmail = email.trim().toLowerCase();

const user = await prisma.user.findUnique({
  where: { email: cleanEmail },
});

  if (!user) {
    throw new Error("User not found");
  }
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new Error("Wrong password");
  }
  const token = generateToken(user);
  const { password: _, ...userWithoutPassword } = user;
  return {
    user: userWithoutPassword,
    token,
  };
};

// CHANGE PASSWORD
const changePassword = async (userId, oldPassword, newPassword) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  const valid = await bcrypt.compare(oldPassword, user.password);

  if (!valid) throw new Error("Old password wrong");

  const hashed = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashed },
  });
  return { message: "Password changed" };
};


// DELETE USER (ADMIN)
const deleteUser = async (id) => {
  await prisma.user.delete({
    where: { id: Number(id) },
  });
  return { message: "User deleted" };
};

module.exports = {
  register,
  login,
  changePassword,
  deleteUser,
};