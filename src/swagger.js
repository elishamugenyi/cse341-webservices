// src/config/swagger.js

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0', // Specifies the OpenAPI version
  info: {
    title: 'Contacts API', // Title of the API documentation
    version: '1.0.0', // Version of the API
    description: 'API Documentation for the Contacts Management System', // Short description of your API
  },
  servers: [
    {
      url: 'https://your-deployment-url.com', // Replace with your deployed URL (this should be render.com but i cannot create another web service on Render)
      description: 'Production server',
    },
    {
      url: 'http://localhost:3000', // Local development server for testing purposes
      description: 'Development server',
    },
  ],
};

// Options for swagger-jsdoc
const options = {
  swaggerDefinition,
  // Paths to files where Swagger is defined using JSDoc comments
  apis: ['./routes/*.js'], // Use the path to match routes location
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJsDoc(options);

module.exports = { swaggerUi, swaggerSpec };
