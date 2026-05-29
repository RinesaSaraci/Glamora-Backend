const express = require("express");
const router = express.Router();

const productController = require("../controllers/product.controller");
const authMiddleware = require("../middleware/auth.middleware");
const { verifySalonOwnership } = require("../middleware/verifySalonOwnership");

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Salon retail products management
 */

/**
 * @swagger
 * /salons/{salonId}/products:
 *   post:
 *     summary: Create a product (Owner/Admin only)
 *     tags: [Products]
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
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *                 example: Serum Hidratues
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *                 example: 25.00
 *               stock:
 *                 type: integer
 *                 example: 50
 *     responses:
 *       201:
 *         description: Product created
 */
router.post("/:salonId/products", authMiddleware, verifySalonOwnership, productController.createProduct);

/**
 * @swagger
 * /salons/{salonId}/products:
 *   get:
 *     summary: Get all products for a salon
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: salonId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of products
 */
router.get("/:salonId/products", productController.getProductsBySalon);

/**
 * @swagger
 * /salons/{salonId}/products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
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
 *         description: Product details
 *       404:
 *         description: Product not found
 */
router.get("/:salonId/products/:id", productController.getProductById);

/**
 * @swagger
 * /salons/{salonId}/products/{id}:
 *   put:
 *     summary: Update a product (Owner/Admin only)
 *     tags: [Products]
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
 *         description: Product updated
 */
router.put("/:salonId/products/:id", authMiddleware, verifySalonOwnership, productController.updateProduct);

/**
 * @swagger
 * /salons/{salonId}/products/{id}:
 *   delete:
 *     summary: Delete a product (Owner/Admin only)
 *     tags: [Products]
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
 *         description: Product deleted
 */
router.delete("/:salonId/products/:id", authMiddleware, verifySalonOwnership, productController.deleteProduct);

module.exports = router;
