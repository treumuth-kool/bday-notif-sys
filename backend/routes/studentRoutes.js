const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

/**
 * @swagger
 * /api/students/upcoming-birthdays:
 *   get:
 *     summary: Get upcoming birthdays in the next 5 days
 *     tags: [Students]
 *     responses:
 *       200:
 *         description: List of upcoming birthdays
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   first_name:
 *                     type: string
 *                   last_name:
 *                     type: string
 *                   birthdate:
 *                     type: string
 *                     format: date
 *                   group_identifier:
 *                     type: string
 *                   age:
 *                     type: integer
 *                   days_until_birthday:
 *                     type: integer
 *       500:
 *         description: Error fetching upcoming birthdays
 */
router.get('/upcoming-birthdays', studentController.getUpcomingBirthdays);

module.exports = router;
