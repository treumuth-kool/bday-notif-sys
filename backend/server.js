require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const userRoutes = require('./routes/userRoutes');
const studentRoutes = require('./routes/studentRoutes');
const emailRoutes = require('./routes/emailRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Log the API_URL to check its value
console.log(`API_URL: ${process.env.API_URL}`);

// Set a default value for API_URL if it's not defined
const apiUrl = process.env.API_URL;

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Birthday Notification System API',
      version: '1.0.0',
      description: 'API for managing birthday notifications',
    },
    servers: [
      {
        url: apiUrl,
      },
    ],
  },
  apis: ['./routes/*.js'], // Path to the API routes files
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

// API routes
app.use('/api/users', userRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/email', emailRoutes);

// Serve index.html for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Catch-all route to serve index.html for any unknown routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Swagger documentation available at ${apiUrl}/api-docs`);
});
