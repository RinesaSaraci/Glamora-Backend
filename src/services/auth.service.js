const bcrypt = require("bcrypt");
// ✅ Duhet të jetë kështu:
const { PrismaClient } = require("@prisma/client");
const { generateToken } = require("../utils/jwt");

const prisma = new PrismaClient();

const register = async (data) => {
  const hashed = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashed,
    },
  });

  const { password, ...userWithoutPassword } = user;

  return userWithoutPassword;
};
const login = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) throw new Error("User not found");

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) throw new Error("Wrong password");

  const token = generateToken(user);

  return { user, token };
};

module.exports = { register, login };