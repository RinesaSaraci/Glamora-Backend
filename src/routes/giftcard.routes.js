const express = require("express");
const router = express.Router();

const giftCardController = require("../controllers/giftcard.controller");
const authMiddleware = require("../middleware/auth.middleware");
const { verifySalonOwnership } = require("../middleware/verifySalonOwnership");

/**
 * @swagger
 * tags:
 *   name: GiftCards
 *   description: Salon gift card management
 */

/**
 * @swagger
 * /salons/{salonId}/gift-cards:
 *   post:
 *     summary: Create a gift card (Owner/Admin only)
 *     tags: [GiftCards]
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
 *               - value
 *             properties:
 *               value:
 *                 type: number
 *                 example: 50.00
 *               code:
 *                 type: string
 *                 example: GIFT2026
 *               issuedToId:
 *                 type: integer
 *               expiresAt:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Gift card created
 */
router.post("/:salonId/gift-cards", authMiddleware, verifySalonOwnership, giftCardController.createGiftCard);

/**
 * @swagger
 * /salons/{salonId}/gift-cards:
 *   get:
 *     summary: Get all gift cards for a salon (Owner/Admin only)
 *     tags: [GiftCards]
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
 *         description: List of gift cards
 */
router.get("/:salonId/gift-cards", authMiddleware, verifySalonOwnership, giftCardController.getGiftCardsBySalon);

/**
 * @swagger
 * /salons/{salonId}/gift-cards/validate/{code}:
 *   get:
 *     summary: Validate a gift card code
 *     tags: [GiftCards]
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
 *         description: Gift card is valid
 *       400:
 *         description: Invalid or expired gift card
 */
router.get("/:salonId/gift-cards/validate/:code", giftCardController.validateGiftCard);

/**
 * @swagger
 * /salons/{salonId}/gift-cards/use/{code}:
 *   put:
 *     summary: Use a gift card (deduct value)
 *     tags: [GiftCards]
 *     security:
 *       - bearerAuth: []
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 30.00
 *     responses:
 *       200:
 *         description: Gift card used successfully
 */
router.put("/:salonId/gift-cards/use/:code", authMiddleware, giftCardController.useGiftCard);

module.exports = router;
