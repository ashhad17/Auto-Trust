const Car = require('../models/Car');
const { handleError } = require('../utils/errorHandler');

// Update car status
exports.updateCarStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const car = await Car.findById(id);
    if (!car) {
      return res.status(404).json({
        success: false,
        error: 'Car not found'
      });
    }

    car.status = status;
    await car.save();

    res.json({
      success: true,
      data: car
    });
  } catch (error) {
    handleError(res, error);
  }
}; 