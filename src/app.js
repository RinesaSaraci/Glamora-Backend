const express = require("express");
const cors = require("cors");
const { swaggerUi, specs } = require("./swagger");

// ROUTES
const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");
const tenantRoutes = require("./routes/tenant.routes");
const aiRoutes = require("./routes/ai.routes");
const salonRoutes = require("./routes/salon.routes");
const serviceRoutes = require("./routes/service.routes");
const employeeRoutes = require("./routes/employee.routes");
const scheduleRoutes = require("./routes/schedule.routes");
const availabilityRoutes = require("./routes/availability.routes");
const reservationRoutes = require("./routes/reservation.routes");
const categoryRoutes = require("./routes/category.routes");
const reviewRoutes = require("./routes/review.routes");
const promotionRoutes = require("./routes/promotion.routes");
const productRoutes = require("./routes/product.routes");
const giftCardRoutes = require("./routes/giftcard.routes");
const waitlistRoutes = require("./routes/waitlist.routes");
const notificationRoutes = require("./routes/notification.routes");

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
app.use("/ai", aiRoutes);
app.use("/salons", salonRoutes);
app.use("/salons", serviceRoutes);
app.use("/salons", employeeRoutes);
app.use("/salons", scheduleRoutes);
app.use("/salons", availabilityRoutes);
app.use("/salons", reservationRoutes);
app.use("/salons", categoryRoutes);
app.use("/salons", reviewRoutes);
app.use("/salons", promotionRoutes);
app.use("/salons", productRoutes);
app.use("/salons", giftCardRoutes);
app.use("/salons", waitlistRoutes);
app.use("/notifications", notificationRoutes);

// =======================
// HEALTH CHECK
// =======================
app.get("/", (req, res) => {
  res.send("Glamora API running...");
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
