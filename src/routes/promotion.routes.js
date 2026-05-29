const express = require("express");
const router = express.Router();

const promotionController = require("../controllers/promotion.controller");
const authMiddleware = require("../middleware/auth.middleware");
const { verifySalonOwnership } = require("../middleware/verifySalonOwnership");

/**
 * @swagger
 * tags:
 *   name: Promotions
 *   description: Salon promotions and discount codes
 */

/**
 * @swagger
 * /salons/{salonId}/promotions:
 *   post:
 *     summary: Create a promotion (Owner/Admin only)
 *     tags: [Promotions]
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
 *               - title
 *               - discountType
 *               - discountValue
 *               - validFrom
 *               - validTo
 *             properties:
 *               title:
 *                 type: string
 *                 example: Zbritje Verore 20%
 *               description:
 *                 type: string
 *               discountType:
 *                 type: string
 *                 enum: [PERCENTAGE, FIXED]
 *               discountValue:
 *                 type: number
 *                 example: 20
 *               code:
 *                 type: string
 *                 example: SUMMER20
 *               validFrom:
 *                 type: string
 *                 format: date
 *               validTo:
 *                 type: string
 *                 format: date
 *               isActive:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Promotion created
 */
router.post("/:salonId/promotions", authMiddleware, verifySalonOwnership, promotionController.createPromotion);

/**
 * @swagger
 * /salons/{salonId}/promotions:
 *   get:
 *     summary: Get all promotions for a salon
 *     tags: [Promotions]
 *     parameters:
 *       - in: path
 *         name: salonId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of promotions
 */
router.get("/:salonId/promotions", promotionController.getPromotionsBySalon);

/**
 * @swagger
 * /salons/{salonId}/promotions/{id}:
 *   get:
 *     summary: Get a promotion by ID
 *     tags: [Promotions]
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
 *         description: Promotion details
 */
router.get("/:salonId/promotions/:id", promotionController.getPromotionById);

/**
 * @swagger
 * /salons/{salonId}/promotions/validate/{code}:
 *   get:
 *     summary: Validate a promotion code
 *     tags: [Promotions]
 *     parameters:
 *       - in: path
 *         name: salonId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Promotion is valid
 *       400:
 *         description: Invalid or expired promotion
 */
router.get("/:salonId/promotions/validate/:code", promotionController.validatePromotion);

/**
 * @swagger
 * /salons/{salonId}/promotions/{id}:
 *   put:
 *     summary: Update a promotion (Owner/Admin only)
 *     tags: [Promotions]
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
 *         description: Promotion updated
 */
router.put("/:salonId/promotions/:id", authMiddleware, verifySalonOwnership, promotionController.updatePromotion);

/**
 * @swagger
 * /salons/{salonId}/promotions/{id}:
 *   delete:
 *     summary: Delete a promotion (Owner/Admin only)
 *     tags: [Promotions]
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
 *         description: Promotion deleted
 */
router.delete("/:salonId/promotions/:id", authMiddleware, verifySalonOwnership, promotionController.deletePromotion);

module.exports = router;
