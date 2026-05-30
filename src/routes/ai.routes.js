const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");
const aiController = require("../controllers/ai.controller");

/**
 * @swagger
 * tags:
 *   name: AI
 *   description: OpenAI integrim - chatbot, rekomandime, gjenerim përshkrimesh
 */

/**
 * @swagger
 * /ai/chat/{salonId}:
 *   post:
 *     summary: Chatbot virtual i salonit
 *     tags: [AI]
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
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *                 example: "Çfarë shërbimesh keni?"
 *               history:
 *                 type: array
 *                 description: Historiku i bisedës (opsional)
 *                 items:
 *                   type: object
 *                   properties:
 *                     role:
 *                       type: string
 *                       enum: [user, assistant]
 *                     content:
 *                       type: string
 *     responses:
 *       200:
 *         description: Përgjigja e AI
 */
router.post("/chat/:salonId", aiController.chat);

/**
 * @swagger
 * /ai/recommendations:
 *   get:
 *     summary: Rekomandime të personalizuara bazuar në historikun e rezervimeve
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista e rekomandimeve
 */
router.get(
  "/recommendations",
  authMiddleware,
  aiController.getRecommendations
);

/**
 * @swagger
 * /ai/generate-description:
 *   post:
 *     summary: Gjenero përshkrim profesional për një shërbim (ADMIN/OWNER)
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - serviceName
 *               - duration
 *               - price
 *             properties:
 *               serviceName:
 *                 type: string
 *                 example: "Gel Manikyr"
 *               duration:
 *                 type: integer
 *                 example: 60
 *               price:
 *                 type: number
 *                 example: 15.00
 *               salonCity:
 *                 type: string
 *                 example: "Prishtinë"
 *     responses:
 *       200:
 *         description: Përshkrimi i gjeneruar
 */
router.post(
  "/generate-description",
  authMiddleware,
  roleMiddleware(["ADMIN", "OWNER"]),
  aiController.generateDescription
);

module.exports = router;
