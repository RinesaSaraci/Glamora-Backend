const express = require("express");
const router = express.Router();

const availabilityController = require("../controllers/availability.controller");

/**
 * @swagger
 * tags:
 *   name: Availability
 *   description: Runtime booking slot calculation
 */

/**
 * @swagger
 * /salons/{salonId}/employees/{employeeId}/availability:
 *   get:
 *     summary: Retrieve available hourly time slots for an employee on a given date
 *     tags: [Availability]
 *     parameters:
 *       - in: path
 *         name: salonId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: employeeId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Format YYYY-MM-DD (e.g. 2026-05-28)
 *     responses:
 *       200:
 *         description: Available hourly slots successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 date:
 *                   type: string
 *                   example: "2026-05-28"
 *                 availableSlots:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: "10:00"
 *       400:
 *         description: Invalid parameters
 */
router.get(
  "/:salonId/employees/:employeeId/availability",
  availabilityController.getAvailability
);

module.exports = router;
