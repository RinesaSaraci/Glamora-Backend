require("dotenv").config();

const express = require("express");
const sequelize = require("./config/db");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

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