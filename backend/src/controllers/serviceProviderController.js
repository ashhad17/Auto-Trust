const ServiceProvider = require('../models/ServiceProvider');
const { handleError } = require('../utils/errorHandler');

// Get all service providers
exports.getAllServiceProviders = async (req, res) => {
  try {
    const serviceProviders = await ServiceProvider.find()
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: serviceProviders
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Get service provider by ID
exports.getServiceProviderById = async (req, res) => {
  try {
    const serviceProvider = await ServiceProvider.findById(req.params.id);
    
    if (!serviceProvider) {
      return res.status(404).json({
        success: false,
        error: 'Service provider not found'
      });
    }
    
    res.json({
      success: true,
      data: serviceProvider
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Create new service provider
exports.createServiceProvider = async (req, res) => {
  try {
    const serviceProvider = new ServiceProvider(req.body);
    await serviceProvider.save();
    
    res.status(201).json({
      success: true,
      data: serviceProvider
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Update service provider
exports.updateServiceProvider = async (req, res) => {
  try {
    const serviceProvider = await ServiceProvider.findById(req.params.id);
    
    if (!serviceProvider) {
      return res.status(404).json({
        success: false,
        error: 'Service provider not found'
      });
    }
    
    const updatedServiceProvider = await ServiceProvider.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      data: updatedServiceProvider
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Delete service provider
exports.deleteServiceProvider = async (req, res) => {
  try {
    const serviceProvider = await ServiceProvider.findById(req.params.id);
    
    if (!serviceProvider) {
      return res.status(404).json({
        success: false,
        error: 'Service provider not found'
      });
    }
    
    await serviceProvider.remove();
    
    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Update service provider status
exports.updateServiceProviderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['active', 'pending', 'inactive'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status'
      });
    }
    
    const serviceProvider = await ServiceProvider.findById(req.params.id);
    
    if (!serviceProvider) {
      return res.status(404).json({
        success: false,
        error: 'Service provider not found'
      });
    }
    
    serviceProvider.status = status;
    await serviceProvider.save();
    
    res.json({
      success: true,
      data: serviceProvider
    });
  } catch (error) {
    handleError(res, error);
  }
}; 