const express = require("express");
const router = express.Router();

const employeeController = require("../controllers/employee.controller");
const authMiddleware = require("../middleware/auth.middleware");
const { verifySalonOwnership } = require("../middleware/tenant.middleware");

/**
 * @swagger
 * tags:
 *   name: Employees
 *   description: Salon Employee Management
 */

/**
 * @swagger
 * /salons/{salonId}/employees:
 *   post:
 *     summary: Create a new employee for a salon (Owner/Admin only)
 *     tags: [Employees]
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
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *                 example: Sara Johnson
 *               email:
 *                 type: string
 *                 example: sara@glamora.com
 *               phone:
 *                 type: string
 *                 example: "+38344123456"
 *     responses:
 *       201:
 *         description: Employee created successfully
 *       400:
 *         description: Bad request
 *       403:
 *         description: Forbidden
 */
router.post(
  "/:salonId/employees",
  authMiddleware,
  verifySalonOwnership,
  employeeController.createEmployee
);

/**
 * @swagger
 * /salons/{salonId}/employees:
 *   get:
 *     summary: Get all employees of a salon
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: salonId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of employees with their services
 */
router.get("/:salonId/employees", employeeController.getEmployeesBySalon);

/**
 * @swagger
 * /salons/{salonId}/employees/{id}:
 *   get:
 *     summary: Get a specific employee with their service qualifications
 *     tags: [Employees]
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
 *         description: Employee details
 *       404:
 *         description: Employee not found
 */
router.get("/:salonId/employees/:id", employeeController.getEmployeeById);

/**
 * @swagger
 * /salons/{salonId}/employees/{id}:
 *   put:
 *     summary: Update an employee (Owner/Admin only)
 *     tags: [Employees]
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
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Employee updated successfully
 *       403:
 *         description: Forbidden
 */
router.put(
  "/:salonId/employees/:id",
  authMiddleware,
  verifySalonOwnership,
  employeeController.updateEmployee
);

/**
 * @swagger
 * /salons/{salonId}/employees/{id}:
 *   delete:
 *     summary: Delete an employee (Owner/Admin only)
 *     tags: [Employees]
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
 *         description: Employee deleted successfully
 *       403:
 *         description: Forbidden
 */
router.delete(
  "/:salonId/employees/:id",
  authMiddleware,
  verifySalonOwnership,
  employeeController.deleteEmployee
);

/**
 * @swagger
 * /salons/{salonId}/employees/{id}/services:
 *   post:
 *     summary: Assign services to an employee (Owner/Admin only)
 *     tags: [Employees]
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
 *               - serviceIds
 *             properties:
 *               serviceIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 2]
 *     responses:
 *       200:
 *         description: Services assigned successfully
 *       400:
 *         description: Bad request
 *       403:
 *         description: Forbidden
 */
router.post(
  "/:salonId/employees/:id/services",
  authMiddleware,
  verifySalonOwnership,
  employeeController.assignServicesToEmployee
);

module.exports = router;
