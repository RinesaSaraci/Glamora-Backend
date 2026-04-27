require("dotenv").config();

const express = require("express");
const sequelize = require("./config/db");
const cors = require("cors");

const app = express();
const authRoutes = require("./routes/auth.routes");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const userRoutes = require("./routes/users.routes");





app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Glamora API running...");
});

const PORT = process.env.PORT || 8080;

async function startServer() {
  try {
    
    await sequelize.authenticate();
    console.log("Database connected successfully!");

 
    await sequelize.sync();

   
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (err) {
    console.log("Database connection error:", err);
  }
}

startServer();