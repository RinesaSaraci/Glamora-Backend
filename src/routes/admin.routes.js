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
  roleMiddleware(["ADMIN"]),
  adminController.deleteUser
);

module.exports = router;