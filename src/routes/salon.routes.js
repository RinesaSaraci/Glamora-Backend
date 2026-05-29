const express = require("express");

const router = express.Router();

const salonController = require("../controllers/salon.controller");

const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");
const { verifySalonOwnership } = require("../middleware/verifySalonOwnership");

/**
 * @swagger
 * tags:
 *   name: Salons
 *   description: Salon management
 */

/**
 * @swagger
 * /salons:
 *   post:
 *     summary: Create salon
 *     tags: [Salons]
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
 *               - city
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               city:
 *                 type: string
 *     responses:
 *       200:
 *         description: Salon created
 */
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  salonController.createSalon
);

/**
 * @swagger
 * /salons:
 *   get:
 *     summary: Get all salons
 *     tags: [Salons]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search salons by name
 *
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: Filter by city
 *     responses:
 *       200:
 *         description: List of salons
 */
router.get("/", salonController.getAllSalons);

/**
 * @swagger
 * /salons/{id}:
 *   get:
 *     summary: Get salon by ID
 *     tags: [Salons]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Salon found
 */
router.get("/:id", salonController.getSalonById);

/**
 * @swagger
 * /salons/{id}:
 *   put:
 *     summary: Update salon
 *     tags: [Salons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Updated
 */
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["ADMIN", "OWNER", "SUPERADMIN"]),
  salonController.updateSalon
);

/**
 * @swagger
 * /salons/{id}:
 *   delete:
 *     summary: Delete salon
 *     tags: [Salons]
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
 *         description: Deleted
 */
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  salonController.deleteSalon
);

module.exports = router;