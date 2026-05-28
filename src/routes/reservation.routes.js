const express = require("express");
const router = express.Router();

const reservationController = require("../controllers/reservation.controller");
const authMiddleware = require("../middleware/auth.middleware");

/**
 * @swagger
 * tags:
 *   name: Reservations
 *   description: Salon Appointment Bookings Management
 */

/**
 * @swagger
 * /salons/{salonId}/reservations:
 *   post:
 *     summary: Create a new reservation for a salon (Authenticated clients only)
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: salonId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - employeeId
 *               - serviceId
 *               - date
 *               - startTime
 *             properties:
 *               employeeId:
 *                 type: integer
 *                 example: 1
 *               serviceId:
 *                 type: integer
 *                 example: 1
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Format YYYY-MM-DD
 *                 example: "2026-05-28"
 *               startTime:
 *                 type: string
 *                 description: Format HH:MM (e.g. 10:00)
 *                 example: "10:00"
 *     responses:
 *       201:
 *         description: Reservation created successfully
 *       400:
 *         description: Validation error or conflict
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/:salonId/reservations",
  authMiddleware,
  reservationController.createReservation
);

module.exports = router;
