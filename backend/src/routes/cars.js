const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const { handleValidationErrors } = require('../middleware/validate');
const carController = require('../controllers/carController');
const { authenticateToken } = require('../middleware/auth');

// Update car status
router.patch(
  '/:id/status',
  authenticateToken,
  [
    param('id').isMongoId().withMessage('Invalid car ID'),
    body('status').isIn(['active', 'sold', 'pending', 'draft']).withMessage('Invalid status value')
  ],
  handleValidationErrors,
  carController.updateCarStatus
);

module.exports = router; 