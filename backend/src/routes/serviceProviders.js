const express = require('express');
const router = express.Router();
const serviceProviderController = require('../controllers/serviceProviderController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// Get all service providers
router.get('/', serviceProviderController.getAllServiceProviders);

// Get service provider by ID
router.get('/:id', serviceProviderController.getServiceProviderById);

// Create new service provider
router.post('/', authenticateToken, serviceProviderController.createServiceProvider);

// Update service provider
router.put('/:id', authenticateToken, serviceProviderController.updateServiceProvider);

// Delete service provider
router.delete('/:id', authenticateToken, serviceProviderController.deleteServiceProvider);

// Update service provider status
router.patch('/:id/status', authenticateToken, serviceProviderController.updateServiceProviderStatus);

module.exports = router; 