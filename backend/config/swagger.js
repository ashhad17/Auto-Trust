const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

// Load Swagger document
const swaggerDocument = YAML.load(path.join(__dirname, '..', 'src', 'docs', 'api.yaml'));

// Swagger UI options
const options = {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'WheelsTrust API Documentation',
  customfavIcon: '/favicon.ico',
  swaggerOptions: {
    persistAuthorization: true,
    docExpansion: 'list'
  }
};

// Export Swagger components
module.exports = {
  swaggerUi,
  swaggerDocument,
  options
}; 