const db = require('../config/db');
const nodemailer = require('nodemailer');

// Create a transporter using the local SMTP server
const transporter = nodemailer.createTransport({
  host: 'localhost',
  port: 25,  // Standard SMTP port
  secure: false,  // Use TLS
  tls: {
    rejectUnauthorized: false  // Accept self-signed certificates
  }
});

exports.sendBirthdayEmails = async (req, res) => {
  try {
    // Fetch users
    const [users] = await db.execute('SELECT id, email FROM users');

    // Fetch upcoming birthdays
    const [birthdays] = await db.execute(`
      SELECT 
        first_name, 
        last_name, 
        birthdate, 
        group_identifier,
        YEAR(CURDATE()) - YEAR(birthdate) + 
          IF(DATE_FORMAT(CURDATE(), '%m%d') >= DATE_FORMAT(birthdate, '%m%d'), 0, -1) AS age
      FROM students
      WHERE 
        DATE_FORMAT(birthdate, '%m-%d') = DATE_FORMAT(CURDATE(), '%m-%d')
    `);

    // Send emails to each user
    for (const user of users) {
      const mailOptions = {
        from: 'Birthday Notification System <info@suva.ee>',
        to: user.email,
        subject: 'Today\'s Birthdays',
        html: generateEmailContent(birthdays)
      };

      await transporter.sendMail(mailOptions);
    }

    res.json({ message: 'Birthday emails sent successfully' });
  } catch (error) {
    console.error('Error sending birthday emails:', error);
    res.status(500).json({ message: 'Error sending birthday emails', error: error.message });
  }
};

function generateEmailContent(birthdays) {
  if (birthdays.length === 0) {
    return '<p>There are no birthdays today.</p>';
  }

  let content = '<h1>Today\'s Birthdays</h1>';
  content += '<ul>';
  birthdays.forEach(student => {
    content += `<li>${student.first_name} ${student.last_name} (${student.group_identifier}) - Turning ${student.age}</li>`;
  });
  content += '</ul>';

  return content;
}
