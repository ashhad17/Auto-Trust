const CarListing = require('../models/CarListing');
const { handleError } = require('../utils/errorHandler');

// Get all car listings
exports.getAllCarListings = async (req, res) => {
  try {
    const carListings = await CarListing.find()
      .populate('seller', 'name email')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: carListings
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Get car listing by ID
exports.getCarListingById = async (req, res) => {
  try {
    const carListing = await CarListing.findById(req.params.id)
      .populate('seller', 'name email');
    
    if (!carListing) {
      return res.status(404).json({
        success: false,
        error: 'Car listing not found'
      });
    }
    
    res.json({
      success: true,
      data: carListing
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Create new car listing
exports.createCarListing = async (req, res) => {
  try {
    const carListing = new CarListing({
      ...req.body,
      seller: req.user._id
    });
    
    await carListing.save();
    
    res.status(201).json({
      success: true,
      data: carListing
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Update car listing
exports.updateCarListing = async (req, res) => {
  try {
    const carListing = await CarListing.findById(req.params.id);
    
    if (!carListing) {
      return res.status(404).json({
        success: false,
        error: 'Car listing not found'
      });
    }
    
    // Check if user is the seller or admin
    if (carListing.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this listing'
      });
    }
    
    const updatedCarListing = await CarListing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      data: updatedCarListing
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Delete car listing
exports.deleteCarListing = async (req, res) => {
  try {
    const carListing = await CarListing.findById(req.params.id);
    
    if (!carListing) {
      return res.status(404).json({
        success: false,
        error: 'Car listing not found'
      });
    }
    
    // Check if user is the seller or admin
    if (carListing.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this listing'
      });
    }
    
    await carListing.remove();
    
    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Update car listing status
exports.updateCarListingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['available', 'pending', 'sold'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status'
      });
    }
    
    const carListing = await CarListing.findById(req.params.id);
    
    if (!carListing) {
      return res.status(404).json({
        success: false,
        error: 'Car listing not found'
      });
    }
    
    // Check if user is the seller or admin
    if (carListing.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this listing'
      });
    }
    
    carListing.status = status;
    await carListing.save();
    
    res.json({
      success: true,
      data: carListing
    });
  } catch (error) {
    handleError(res, error);
  }
}; 