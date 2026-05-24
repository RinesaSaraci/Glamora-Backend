const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const { swaggerUi, specs } = require("./swagger");
const authRoutes = require("./routes/auth.routes.js");

const app = express();
const prisma = new PrismaClient();

// ✅ MIDDLEWARE FIRST
app.use(cors());
app.use(express.json());

console.log("authRoutes =", authRoutes);
// ✅ ROUTES
app.use("/auth", authRoutes);

// ✅ TEST ROUTES
app.get("/", (req, res) => {
  res.send("Glamora API running...");
});

app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

// ✅ SWAGGER (after everything)
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs)
);


// SERVER
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});