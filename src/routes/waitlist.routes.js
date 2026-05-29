const express = require("express");
const router = express.Router();

const waitlistController = require("../controllers/waitlist.controller");
const authMiddleware = require("../middleware/auth.middleware");
const { verifySalonOwnership } = require("../middleware/verifySalonOwnership");

/**
 * @swagger
 * tags:
 *   name: Waitlist
 *   description: Waitlist management for fully booked slots
 */

/**
 * @swagger
 * /salons/{salonId}/waitlist:
 *   post:
 *     summary: Join the waitlist for a slot (Authenticated users)
 *     tags: [Waitlist]
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
 *             properties:
 *               employeeId:
 *                 type: integer
 *               serviceId:
 *                 type: integer
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2026-06-10"
 *     responses:
 *       201:
 *         description: Added to waitlist
 */
router.post("/:salonId/waitlist", authMiddleware, waitlistController.joinWaitlist);

/**
 * @swagger
 * /salons/{salonId}/waitlist:
 *   get:
 *     summary: Get full waitlist for a salon (Owner/Admin only)
 *     tags: [Waitlist]
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
 *         description: Waitlist entries
 */
router.get("/:salonId/waitlist", authMiddleware, verifySalonOwnership, waitlistController.getWaitlistBySalon);

/**
 * @swagger
 * /salons/{salonId}/waitlist/my:
 *   get:
 *     summary: Get current user's waitlist entries
 *     tags: [Waitlist]
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
 *         description: User waitlist entries
 */
router.get("/:salonId/waitlist/my", authMiddleware, waitlistController.getCustomerWaitlist);

/**
 * @swagger
 * /salons/{salonId}/waitlist/{id}/status:
 *   put:
 *     summary: Update waitlist entry status (Owner/Admin only)
 *     tags: [Waitlist]
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
 *                 enum: [WAITING, NOTIFIED, CANCELLED]
 *     responses:
 *       200:
 *         description: Status updated
 */
router.put("/:salonId/waitlist/:id/status", authMiddleware, verifySalonOwnership, waitlistController.updateWaitlistStatus);

module.exports = router;
