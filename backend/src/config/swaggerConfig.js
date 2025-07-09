const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'MovieHub API',
            version: '1.0.0',
            description: 'API documentation for MovieHub',
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT}/api`,
            },
        ],
    },
    apis: ['./src/routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = { swaggerUi, swaggerDocs };