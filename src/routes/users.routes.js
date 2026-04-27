const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

// ===============================
// AUTH MIDDLEWARE (JWT)
// ===============================
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

// ===============================
// GET CURRENT USER (/me)
// ===============================
/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Get logged-in user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns current user
 *       401:
 *         description: Unauthorized
 */
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ===============================
// GET ALL USERS (ADMIN ONLY)
// ===============================
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users (Admin/SuperAdmin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    // role check
    if (req.user.role !== "SUPER_ADMIN") {
      return res.status(403).json({ message: "Access denied" });
    }

    const users = await User.findAll({
      attributes: { exclude: ["password"] },
    });

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ===============================
// UPDATE USER PROFILE
// ===============================
/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 */
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { name, email } = req.body;

    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // vetëm vetja ose admin
    if (req.user.id !== req.params.id && req.user.role !== "SUPER_ADMIN") {
      return res.status(403).json({ message: "Not allowed" });
    }

    await user.update({ name, email });

    res.json({
      message: "User updated successfully",
      user,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ===============================
// DELETE USER (ADMIN ONLY)
// ===============================
/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete user (Admin only)
 *     tags: [Users]
 */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "SUPER_ADMIN") {
      return res.status(403).json({ message: "Access denied" });
    }

    await User.destroy({ where: { id: req.params.id } });

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;