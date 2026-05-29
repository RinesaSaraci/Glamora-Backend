const express = require("express");
const cors = require("cors");
const { swaggerUi, specs } = require("./swagger");

// ROUTES
const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");
const tenantRoutes = require("./routes/tenant.routes");
const salonRoutes = require("./routes/salon.routes");
const serviceRoutes = require("./routes/service.routes");
const employeeRoutes = require("./routes/employee.routes");
const scheduleRoutes = require("./routes/schedule.routes");
const availabilityRoutes = require("./routes/availability.routes");
const reservationRoutes = require("./routes/reservation.routes");

const app = express();

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
app.use("/tenants", tenantRoutes);
app.use("/salons", salonRoutes);
app.use("/salons", serviceRoutes);
app.use("/salons", employeeRoutes);
app.use("/salons", scheduleRoutes);
app.use("/salons", availabilityRoutes);
app.use("/salons", reservationRoutes);

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