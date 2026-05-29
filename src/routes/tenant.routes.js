const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");
const tenantController = require("../controllers/tenant.controller");

/**
 * @swagger
 * tags:
 *   name: Tenants
 *   description: Tenant management (SUPERADMIN only)
 */

/**
 * @swagger
 * /tenants:
 *   post:
 *     summary: Create a new tenant (SUPERADMIN only)
 *     tags: [Tenants]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Glamora Prishtina"
 *               slug:
 *                 type: string
 *                 example: "glamora-prishtina"
 *     responses:
 *       201:
 *         description: Tenant created
 *       409:
 *         description: Slug already exists
 */
router.post("/", authMiddleware, roleMiddleware(["SUPERADMIN"]), tenantController.createTenant);

/**
 * @swagger
 * /tenants:
 *   get:
 *     summary: List all tenants with counts (SUPERADMIN only)
 *     tags: [Tenants]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of tenants
 */
router.get("/", authMiddleware, roleMiddleware(["SUPERADMIN"]), tenantController.getAllTenants);

/**
 * @swagger
 * /tenants/{id}:
 *   get:
 *     summary: Get tenant details with salons and users (SUPERADMIN only)
 *     tags: [Tenants]
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
 *         description: Tenant details
 *       404:
 *         description: Tenant not found
 */
router.get("/:id", authMiddleware, roleMiddleware(["SUPERADMIN"]), tenantController.getTenantById);

/**
 * @swagger
 * /tenants/{tenantId}/users/{userId}:
 *   patch:
 *     summary: Assign a user to this tenant (SUPERADMIN only)
 *     tags: [Tenants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tenantId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User assigned to tenant
 *       404:
 *         description: User or tenant not found
 */
router.patch(
  "/:tenantId/users/:userId",
  authMiddleware,
  roleMiddleware(["SUPERADMIN"]),
  tenantController.assignUserToTenant
);

module.exports = router;
