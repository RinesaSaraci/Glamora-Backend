require("dotenv").config();
const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || "sekreti_yt_gullamora_rezervë", // Shtuar një fallback string
    { expiresIn: "1d" }
  );
};

module.exports = { generateToken };