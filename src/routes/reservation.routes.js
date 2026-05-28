const express = require("express");
const router = express.Router();

const reservationController = require("../controllers/reservation.controller");
const authMiddleware = require("../middleware/auth.middleware");

/**
 * @swagger
 * tags:
 *   name: Reservations
 *   description: Client bookings and reservation management
 */

/**
 * @swagger
 * /salons/{salonId}/reservations:
 *   post:
 *     summary: Book an appointment (Authenticated Client/User only)
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
 *                 description: YYYY-MM-DD format (e.g. 2026-05-28)
 *                 example: "2026-05-28"
 *               startTime:
 *                 type: string
 *                 description: HH:MM format
 *                 example: "10:00"
 *     responses:
 *       201:
 *         description: Appointment booked successfully
 *       400:
 *         description: Bad request (slot booked, invalid date, unqualified staff, etc.)
 *       401:
 *         description: Unauthorized (missing or invalid token)
 */
router.post(
  "/:salonId/reservations",
  authMiddleware,
  reservationController.createReservation
);

module.exports = router;
