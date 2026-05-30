const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");
const adminController = require("../controllers/admin.controller");

/**
 * @swagger
 * /admin/users/{id}:
 *   delete:
 *     summary: Delete user (ADMIN ONLY)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User deleted
 */
router.delete(
  "/users/:id",
  authMiddleware,
  roleMiddleware(["ADMIN", "SUPERADMIN"]),
  adminController.deleteUser
);

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Get all users (ADMIN/SUPERADMIN only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 */
router.get(
  "/users",
  authMiddleware,
  roleMiddleware(["ADMIN", "SUPERADMIN"]),
  adminController.getAllUsers
);

router.patch(
  "/users/:id",
  authMiddleware,
  roleMiddleware(["ADMIN", "SUPERADMIN"]),
  adminController.updateUser
);

module.exports = router;