const db = require('../config/db');

exports.getUpcomingBirthdays = async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT 
                id, 
                first_name, 
                last_name, 
                birthdate, 
                group_identifier,
                YEAR(CURDATE()) - YEAR(birthdate) + 
                    IF(DATE_FORMAT(CURDATE(), '%m%d') >= DATE_FORMAT(birthdate, '%m%d'), 0, -1) AS age,
                DATEDIFF(
                    DATE_ADD(birthdate, 
                        INTERVAL YEAR(CURDATE()) - YEAR(birthdate) + 
                        IF(DATE_FORMAT(CURDATE(), '%m%d') > DATE_FORMAT(birthdate, '%m%d'), 1, 0) YEAR),
                    CURDATE()
                ) AS days_until_birthday
            FROM students
            WHERE 
                DATEDIFF(
                    DATE_ADD(birthdate, 
                        INTERVAL YEAR(CURDATE()) - YEAR(birthdate) + 
                        IF(DATE_FORMAT(CURDATE(), '%m%d') > DATE_FORMAT(birthdate, '%m%d'), 1, 0) YEAR),
                    CURDATE()
                ) BETWEEN 0 AND 5
            ORDER BY days_until_birthday ASC
        `);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching upcoming birthdays:', error);
        res.status(500).json({ message: 'Error fetching upcoming birthdays', error: error.message });
    }
};
