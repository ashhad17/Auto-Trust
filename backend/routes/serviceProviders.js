const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getServiceProviders,
  getServiceProvider,
  createServiceProvider,
  updateServiceProvider,
  deleteServiceProvider,
  updateServiceProviderStatus,
  updateServiceProviderVerification
} = require('../controllers/serviceProviderController');
const { validateServiceProvider, validateServiceProviderStatus, handleValidationErrors } = require('../middleware/validate');
const upload = require('../middleware/upload');

// @route   GET /api/v1/service-providers
// @desc    Get all service providers
// @access  Public
router.get('/', getServiceProviders);

// @route   GET /api/v1/service-providers/:id
// @desc    Get single service provider
// @access  Public
router.get('/:id', getServiceProvider);

// @route   POST /api/v1/service-providers
// @desc    Create new service provider
// @access  Private
router.post('/', protect, authorize('user', 'admin'), upload.array('images', 5), validateServiceProvider, handleValidationErrors, createServiceProvider);

// @route   PUT /api/v1/service-providers/:id
// @desc    Update service provider
// @access  Private
router.put('/:id', protect, authorize('user', 'admin'), upload.array('images', 5), validateServiceProvider, handleValidationErrors, updateServiceProvider);

// @route   DELETE /api/v1/service-providers/:id
// @desc    Delete service provider
// @access  Private
router.delete('/:id', protect, authorize('user', 'admin'), deleteServiceProvider);

// @route   PATCH /api/v1/service-providers/:id/status
// @desc    Update service provider status
// @access  Private
router.patch('/:id/status', protect, authorize('user', 'admin'), validateServiceProviderStatus, handleValidationErrors, updateServiceProviderStatus);

// @route   PATCH /api/v1/service-providers/:id/verify
// @desc    Update service provider verification status
// @access  Private (Admin only)
router.patch('/:id/verify', protect, authorize('admin'), updateServiceProviderVerification);

module.exports = router; 