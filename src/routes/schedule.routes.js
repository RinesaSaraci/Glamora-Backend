const express = require("express");
const router = express.Router();

const scheduleController = require("../controllers/schedule.controller");
const authMiddleware = require("../middleware/auth.middleware");
const { verifySalonOwnership } = require("../middleware/tenant.middleware");

/**
 * @swagger
 * tags:
 *   name: Schedules
 *   description: Employee Weekly Shifts configuration
 */

/**
 * @swagger
 * /salons/{salonId}/employees/{employeeId}/schedules:
 *   post:
 *     summary: Set recurring weekly working shifts for an employee (Owner/Admin only)
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - schedules
 *             properties:
 *               schedules:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - dayOfWeek
 *                     - startTime
 *                     - endTime
 *                   properties:
 *                     dayOfWeek:
 *                       type: integer
 *                       description: 0 = Sunday, 1 = Monday, ..., 6 = Saturday
 *                       example: 1
 *                     startTime:
 *                       type: string
 *                       description: HH:MM format
 *                       example: "09:00"
 *                     endTime:
 *                       type: string
 *                       description: HH:MM format
 *                       example: "17:00"
 *     responses:
 *       200:
 *         description: Schedules synced successfully
 *       400:
 *         description: Bad request
 *       403:
 *         description: Forbidden
 */
router.post(
  "/:salonId/employees/:employeeId/schedules",
  authMiddleware,
  verifySalonOwnership,
  scheduleController.setSchedules
);

/**
 * @swagger
 * /salons/{salonId}/employees/{employeeId}/schedules:
 *   get:
 *     summary: Get weekly working shifts of an employee
 *     tags: [Schedules]
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
 *         description: Weekly schedules list
 */
router.get(
  "/:salonId/employees/:employeeId/schedules",
  scheduleController.getEmployeeSchedules
);

module.exports = router;
