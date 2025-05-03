const mongoose = require('mongoose');

const carListingSchema = new mongoose.Schema({
  make: {
    type: String,
    required: [true, 'Make is required'],
    trim: true
  },
  model: {
    type: String,
    required: [true, 'Model is required'],
    trim: true
  },
  year: {
    type: Number,
    required: [true, 'Year is required'],
    min: [1900, 'Year must be at least 1900'],
    max: [new Date().getFullYear() + 1, 'Year cannot be in the future']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price must be positive']
  },
  mileage: {
    type: Number,
    required: [true, 'Mileage is required'],
    min: [0, 'Mileage must be positive']
  },
  condition: {
    type: String,
    required: [true, 'Condition is required'],
    enum: {
      values: ['new', 'used', 'certified'],
      message: 'Condition must be new, used, or certified'
    }
  },
  status: {
    type: String,
    required: [true, 'Status is required'],
    enum: {
      values: ['available', 'pending', 'sold'],
      message: 'Status must be available, pending, or sold'
    },
    default: 'available'
  },
  images: [{
    type: String,
    required: [true, 'At least one image is required']
  }],
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  features: [{
    type: String,
    trim: true
  }],
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Add text index for search functionality
carListingSchema.index({ make: 'text', model: 'text', description: 'text' });

module.exports = mongoose.model('CarListing', carListingSchema); 