const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const { swaggerUi, specs } = require("./swagger");

// ROUTES
const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");
const salonRoutes = require("./routes/salon.routes");

const app = express();
const prisma = new PrismaClient();

// =======================
// GLOBAL MIDDLEWARE
// =======================
app.use(cors());
app.use(express.json());

// =======================
// ROUTES
// =======================
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/salons", salonRoutes);

// =======================
// TEST ROUTES
// =======================
app.get("/", (req, res) => {
  res.send("Glamora API running...");
});

// GET ALL USERS
app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  res.json(users);
});

// =======================
// SWAGGER
// =======================
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// =======================
// SERVER
// =======================
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});