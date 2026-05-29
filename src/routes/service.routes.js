const express = require("express");
const router = express.Router();

const serviceController = require("../controllers/service.controller");
const authMiddleware = require("../middleware/auth.middleware");
const { verifySalonOwnership } = require("../middleware/verifySalonOwnership");

/**
 * @swagger
 * tags:
 *   name: Services
 *   description: Salon Services Management nested inside Salons
 */

/**
 * @swagger
 * /salons/{salonId}/services:
 *   post:
 *     summary: Create a new service for a salon (Owner/Admin only)
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: salonId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the salon
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - duration
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *                 example: Luxury Hydrafacial
 *               description:
 *                 type: string
 *                 example: Deep cleansing and skin hydration therapy.
 *               duration:
 *                 type: integer
 *                 example: 60
 *               price:
 *                 type: number
 *                 example: 85.00
 *     responses:
 *       201:
 *         description: Service created successfully
 *       400:
 *         description: Bad request
 *       403:
 *         description: Forbidden - Not the salon owner
 *       404:
 *         description: Salon not found
 */
router.post(
  "/:salonId/services",
  authMiddleware,
  verifySalonOwnership,
  serviceController.createService
);

/**
 * @swagger
 * /salons/{salonId}/services:
 *   get:
 *     summary: Get all services for a specific salon
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: salonId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the salon
 *     responses:
 *       200:
 *         description: List of salon services
 */
router.get("/:salonId/services", serviceController.getServicesBySalon);

/**
 * @swagger
 * /salons/{salonId}/services/{id}:
 *   get:
 *     summary: Get a specific service details
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: salonId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Service details retrieved
 *       404:
 *         description: Service not found
 */
router.get("/:salonId/services/:id", serviceController.getServiceById);

/**
 * @swagger
 * /salons/{salonId}/services/{id}:
 *   put:
 *     summary: Update a service (Owner/Admin only)
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: salonId
 *         required: true
 *         schema:
 *           type: integer
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
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               duration:
 *                 type: integer
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Service updated successfully
 *       403:
 *         description: Forbidden - Not the salon owner
 */
router.put(
  "/:salonId/services/:id",
  authMiddleware,
  verifySalonOwnership,
  serviceController.updateService
);

/**
 * @swagger
 * /salons/{salonId}/services/{id}:
 *   delete:
 *     summary: Delete a service (Owner/Admin only)
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: salonId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Service deleted successfully
 *       403:
 *         description: Forbidden
 */
router.delete(
  "/:salonId/services/:id",
  authMiddleware,
  verifySalonOwnership,
  serviceController.deleteService
);

module.exports = router;
