const express = require('express');
const router = express.Router();
const carListingController = require('../controllers/carListingController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// Get all car listings
router.get('/', carListingController.getAllCarListings);

// Get car listing by ID
router.get('/:id', carListingController.getCarListingById);

// Create new car listing
router.post('/', authenticateToken, carListingController.createCarListing);

// Update car listing
router.put('/:id', authenticateToken, carListingController.updateCarListing);

// Delete car listing
router.delete('/:id', authenticateToken, carListingController.deleteCarListing);

// Update car listing status
router.patch('/:id/status', authenticateToken, carListingController.updateCarListingStatus);

module.exports = router; 