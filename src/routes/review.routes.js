const express = require("express");
const router = express.Router();

const reviewController = require("../controllers/review.controller");
const authMiddleware = require("../middleware/auth.middleware");

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Client reviews for salons and employees
 */

/**
 * @swagger
 * /salons/{salonId}/reservations/{reservationId}/review:
 *   post:
 *     summary: Leave a review for a completed reservation (Client only)
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: salonId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: reservationId
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
 *               - rating
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *               comment:
 *                 type: string
 *                 example: Shërbim i shkëlqyer!
 *     responses:
 *       201:
 *         description: Review created
 *       400:
 *         description: Already reviewed or reservation not completed
 */
router.post(
  "/:salonId/reservations/:reservationId/review",
  authMiddleware,
  reviewController.createReview
);

/**
 * @swagger
 * /salons/{salonId}/reviews:
 *   get:
 *     summary: Get all reviews for a salon
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: salonId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of reviews
 */
router.get("/:salonId/reviews", reviewController.getReviewsBySalon);

/**
 * @swagger
 * /salons/{salonId}/employees/{employeeId}/reviews:
 *   get:
 *     summary: Get all reviews for a specific employee
 *     tags: [Reviews]
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
 *     responses:
 *       200:
 *         description: List of employee reviews
 */
router.get("/:salonId/employees/:employeeId/reviews", reviewController.getReviewsByEmployee);

module.exports = router;
