const Car = require('../models/Car');
const ErrorResponse = require('../utils/errorResponse');


// @route   GET /api/v1/cars
// @access  Public
// exports.getCars = async (req, res, next) => {
//   try {
//     // Copy req.query
//     const reqQuery = { ...req.query };

//     // Fields to exclude
//     const removeFields = ['select', 'sort', 'page', 'limit'];

//     // Loop over removeFields and delete them from reqQuery
//     removeFields.forEach(param => delete reqQuery[param]);

//     // Create query string
//     let queryStr = JSON.stringify(reqQuery);

//     // Create operators ($gt, $gte, etc)
//     queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

//     // Finding resource
//     let query = Car.find(JSON.parse(queryStr)).populate({
//       path: 'seller',
//       select: 'name'
//     });

//     // Select Fields
//     if (req.query.select) {
//       const fields = req.query.select.split(',').join(' ');
//       query = query.select(fields);
//     }

//     // Sort
//     if (req.query.sort) {
//       const sortBy = req.query.sort.split(',').join(' ');
//       query = query.sort(sortBy);
//     } else {
//       query = query.sort('-createdAt');
//     }

//     // Pagination
//     const page = parseInt(req.query.page, 10) || 1;
//     const limit = parseInt(req.query.limit, 10) || 10;
//     const startIndex = (page - 1) * limit;
//     const endIndex = page * limit;
//     const total = await Car.countDocuments(JSON.parse(queryStr));

//     query = query.skip(startIndex).limit(limit);

//     // Executing query
//     const cars = await query;

//     // Pagination result
//     const pagination = {};

//     if (endIndex < total) {
//       pagination.next = {
//         page: page + 1,
//         limit
//       };
//     }

//     if (startIndex > 0) {
//       pagination.prev = {
//         page: page - 1,
//         limit
//       };
//     }

//     res.status(200).json({
//       success: true,
//       data: {
//         cars,
//         pagination: {
//           total,
//           pages: Math.ceil(total / limit),
//           currentPage: page,
//           limit
//         }
//       }
//     });
//   } catch (err) {
//     next(err);
//   }
// };
// @desc    Get all car listings
// @route   GET /api/v1/cars
// @access  Public
exports.getCars = async (req, res, next) => {
  try {
    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // Finding resource
    let query = Car.find(JSON.parse(queryStr)).populate({
      path: 'seller',
      select: 'name'
    });

    // Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Car.countDocuments(JSON.parse(queryStr));

    query = query.skip(startIndex).limit(limit);

    // Executing query
    const cars = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.status(200).json({
      success: true,
      count: cars.length,
      pagination,
      data: cars
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new car listing
// @route   POST /api/v1/cars
// @access  Private
exports.createCar = async (req, res, next) => {
  try {
    req.body.seller = req.user.id;

    // Create title from year, make, model
    const { year, make, model } = req.body;
    req.body.title = `${year} ${make} ${model}`;

    // Validate and parse images
    if (typeof req.body.images === 'string') {
      try {
        const parsedImages = JSON.parse(req.body.images);
        if (Array.isArray(parsedImages) && parsedImages.every(img => img.url && img.publicId)) {
          req.body.images = parsedImages;
        } else {
          return next(new ErrorResponse('Invalid image format', 400));
        }
      } catch (err) {
        return next(new ErrorResponse('Failed to parse images JSON', 400));
      }
    }

    // Validate new fields
    if (req.body.fuelType && !['Gasoline', 'Diesel', 'Hybrid', 'Electric', 'Other'].includes(req.body.fuelType)) {
      return next(new ErrorResponse('Invalid fuel type', 400));
    }

    if (req.body.transmission && !['Automatic', 'Manual', 'CVT', 'Semi-Automatic'].includes(req.body.transmission)) {
      return next(new ErrorResponse('Invalid transmission type', 400));
    }

    // Parse document uploads if coming as JSON strings
    ['rcDocument', 'insuranceDocument', 'pucDocument'].forEach(field => {
      if (typeof req.body[field] === 'string') {
        try {
          req.body[field] = JSON.parse(req.body[field]);
        } catch (err) {
          return next(new ErrorResponse(`Invalid ${field} format`, 400));
        }
      }
    });

    const car = await Car.create(req.body);

    res.status(201).json({
      success: true,
      data: car
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update car listing
// @route   PUT /api/v1/cars/:id
// @access  Private
exports.updateCar = async (req, res, next) => {
  try {
    let car = await Car.findById(req.params.id);

    if (!car) {
      return next(
        new ErrorResponse(`Car not found with id of ${req.params.id}`, 404)
      );
    }

    // Make sure user is car owner or admin
    if (car.seller.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to update this listing`,
          403
        )
      );
    }

    // Validate and parse images
    if (typeof req.body.images === 'string') {
      try {
        const parsedImages = JSON.parse(req.body.images);
        if (Array.isArray(parsedImages) && parsedImages.every(img => img.url && img.publicId)) {
          req.body.images = parsedImages;
        } else {
          return next(new ErrorResponse('Invalid image format', 400));
        }
      } catch (err) {
        return next(new ErrorResponse('Failed to parse images JSON', 400));
      }
    }

    // Validate new fields
    if (req.body.fuelType && !['Gasoline', 'Diesel', 'Hybrid', 'Electric', 'Other'].includes(req.body.fuelType)) {
      return next(new ErrorResponse('Invalid fuel type', 400));
    }

    if (req.body.transmission && !['Automatic', 'Manual', 'CVT', 'Semi-Automatic'].includes(req.body.transmission)) {
      return next(new ErrorResponse('Invalid transmission type', 400));
    }

    // Parse document uploads
    ['rcDocument', 'insuranceDocument', 'pucDocument'].forEach(field => {
      if (typeof req.body[field] === 'string') {
        try {
          req.body[field] = JSON.parse(req.body[field]);
        } catch (err) {
          return next(new ErrorResponse(`Invalid ${field} format`, 400));
        }
      }
    });

    // Update title if year, make or model changes
    if (req.body.year || req.body.make || req.body.model) {
      const year = req.body.year || car.year;
      const make = req.body.make || car.make;
      const model = req.body.model || car.model;
      req.body.title = `${year} ${make} ${model}`;
    }

    car = await Car.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: car
    });
  } catch (err) {
    next(err);
  }
};
// @desc    Get single car listing
// @route   GET /api/v1/cars/:id
// @access  Public
exports.getCar = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id).populate({
      path: 'seller',
      select: 'name phone email'
    });

    if (!car) {
      return next(
        new ErrorResponse(`Car not found with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      success: true,
      data: car
    });
  } catch (err) {
    next(err);
  }
};

// @route   POST /api/v1/cars
// @access  Private
// exports.createCar = async (req, res, next) => {
//   try {
//     req.body.seller = req.user.id;

//     // Create title from year, make, model
//     const { year, make, model } = req.body;
//     req.body.title = `${year} ${make} ${model}`;

//     // Parse document uploads if coming as JSON strings
//     ['rcDocument', 'insuranceDocument', 'pucDocument'].forEach(field => {
//       if (typeof req.body[field] === 'string') {
//         req.body[field] = JSON.parse(req.body[field]);
//       }
//     });

//     const car = await Car.create(req.body);

//     res.status(201).json({
//       success: true,
//       message: 'Car listing created successfully',
//       data: car
//     });
//   } catch (err) {
//     next(err);
//   }
// };


// @desc    Update car listing
// @route   PUT /api/v1/cars/:id
// @access  Private
// exports.updateCar = async (req, res, next) => {
//   try {
//     let car = await Car.findById(req.params.id);

//     if (!car) {
//       return next(
//         new ErrorResponse(`Car not found with id of ${req.params.id}`, 404)
//       );
//     }

//     // Make sure user is car owner or admin
//     if (car.seller.toString() !== req.user.id && req.user.role !== 'admin') {
//       return next(
//         new ErrorResponse(
//           `User ${req.user.id} is not authorized to update this listing`,
//           403
//         )
//       );
//     }

//     car = await Car.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true
//     });

//     res.status(200).json({
//       success: true,
//       message: 'Car listing updated successfully',
//       data: car
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// @desc    Delete car listing
// @route   DELETE /api/v1/cars/:id
// @access  Private
exports.deleteCar = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return next(
        new ErrorResponse(`Car not found with id of ${req.params.id}`, 404)
      );
    }

    // Make sure user is car owner or admin
    if (car.seller.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to delete this listing`,
          403
        )
      );
    }

    await car.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Car listing deleted successfully'
    });
  } catch (err) {
    next(err);
  }
};
//get cars by seller id
exports.getCarsBySellerId = async (req, res, next) => {
  try {
    const cars = await Car.find({ seller: req.params.id });
    res.status(200).json({ success: true, data: cars });
  } catch (err) {
    next(err);
  }
};
// @desc    Update car status
// @route   PATCH /api/v1/cars/:id/status
// @access  Private
exports.updateCarStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['active', 'sold', 'pending', 'draft'].includes(status)) {
      return next(new ErrorResponse('Invalid status value', 400));
    }

    let car = await Car.findById(req.params.id);

    if (!car) {
      return next(
        new ErrorResponse(`Car not found with id of ${req.params.id}`, 404)
      );
    }

    // Make sure user is car owner or admin
    if (car.seller.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to update this listing`,
          403
        )
      );
    }

    car = await Car.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: Date.now() },
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      message: 'Car listing status updated successfully',
      data: {
        id: car._id,
        title: car.title,
        status: car.status,
        updatedAt: car.updatedAt
      }
    });
  } catch (err) {
    next(err);
  }
}; 