const express = require('express');
const router = express.Router();
const emailController = require('../controllers/emailController');

/**
 * @swagger
 * /api/email/send-birthday-emails:
 *   post:
 *     summary: Send birthday emails to all users
 *     tags: [Email]
 *     responses:
 *       200:
 *         description: Birthday emails sent successfully
 *       500:
 *         description: Error sending birthday emails
 */
router.post('/send-birthday-emails', emailController.sendBirthdayEmails);

module.exports = router;
