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

/**
 * @swagger
 * /salons/{salonId}/reservations:
 *   get:
 *     summary: Retrieve all reservations for a salon (Owner/Admin only)
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: salonId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of salon reservations
 *       403:
 *         description: Forbidden - Not the salon owner or admin
 */
router.get(
  "/:salonId/reservations",
  authMiddleware,
  require("../middleware/tenant.middleware").verifySalonOwnership,
  reservationController.getSalonReservations
);

/**
 * @swagger
 * /salons/{salonId}/reservations/my-bookings:
 *   get:
 *     summary: Retrieve all bookings made by the currently logged-in customer
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: salonId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of personal bookings
 */
router.get(
  "/:salonId/reservations/my-bookings",
  authMiddleware,
  reservationController.getCustomerReservations
);

/**
 * @swagger
 * /salons/{salonId}/reservations/{id}/status:
 *   put:
 *     summary: Update reservation status (Owner/Admin/Client)
 *     description: Clients can only set their reservation to CANCELLED. Salon owners and admins can set it to any status (PENDING, CONFIRMED, CANCELLED, COMPLETED).
 *     tags: [Reservations]
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
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, CONFIRMED, CANCELLED, COMPLETED]
 *                 example: "CONFIRMED"
 *     responses:
 *       200:
 *         description: Status updated successfully
 *       400:
 *         description: Invalid status or bad request
 *       403:
 *         description: Forbidden - Unauthorized to change this reservation status
 */
router.put(
  "/:salonId/reservations/:id/status",
  authMiddleware,
  reservationController.updateReservationStatus
);

module.exports = router;
