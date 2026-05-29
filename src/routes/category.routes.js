const express = require("express");
const router = express.Router();

const categoryController = require("../controllers/category.controller");
const authMiddleware = require("../middleware/auth.middleware");
const { verifySalonOwnership } = require("../middleware/verifySalonOwnership");

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Service category management per salon
 */

/**
 * @swagger
 * /salons/{salonId}/categories:
 *   post:
 *     summary: Create a category for a salon (Owner/Admin only)
 *     tags: [Categories]
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
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Flokë
 *               description:
 *                 type: string
 *                 example: Shërbime të flokëve
 *     responses:
 *       201:
 *         description: Category created
 */
router.post("/:salonId/categories", authMiddleware, verifySalonOwnership, categoryController.createCategory);

/**
 * @swagger
 * /salons/{salonId}/categories:
 *   get:
 *     summary: Get all categories for a salon
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: salonId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of categories with their services
 */
router.get("/:salonId/categories", categoryController.getCategoriesBySalon);

/**
 * @swagger
 * /salons/{salonId}/categories/{id}:
 *   get:
 *     summary: Get a specific category
 *     tags: [Categories]
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
 *         description: Category details
 *       404:
 *         description: Category not found
 */
router.get("/:salonId/categories/:id", categoryController.getCategoryById);

/**
 * @swagger
 * /salons/{salonId}/categories/{id}:
 *   put:
 *     summary: Update a category (Owner/Admin only)
 *     tags: [Categories]
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
 *     responses:
 *       200:
 *         description: Category updated
 */
router.put("/:salonId/categories/:id", authMiddleware, verifySalonOwnership, categoryController.updateCategory);

/**
 * @swagger
 * /salons/{salonId}/categories/{id}:
 *   delete:
 *     summary: Delete a category (Owner/Admin only)
 *     tags: [Categories]
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
 *         description: Category deleted
 */
router.delete("/:salonId/categories/:id", authMiddleware, verifySalonOwnership, categoryController.deleteCategory);

module.exports = router;
