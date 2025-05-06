const Booking = require('../models/Booking');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all bookings
// @route   GET /api/v1/bookings
// @access  Private
exports.getBookings = async (req, res, next) => {
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
    let query = Booking.find(JSON.parse(queryStr))
      .populate({
        path: 'user',
        select: 'name email'
      })
      .populate({
        path: 'serviceProvider',
        select: 'name email'
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
    const total = await Booking.countDocuments(JSON.parse(queryStr));

    query = query.skip(startIndex).limit(limit);

    // Executing query
    const bookings = await query;

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
      data: {
        bookings,
        pagination: {
          total,
          pages: Math.ceil(total / limit),
          currentPage: page,
          limit
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single booking
// @route   GET /api/v1/bookings/:id
// @access  Private
exports.getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate({
        path: 'user',
        select: 'name email phone'
      })
      .populate({
        path: 'serviceProvider',
        select: 'name email phone'
      });

    if (!booking) {
      return next(
        new ErrorResponse(`Booking not found with id of ${req.params.id}`, 404)
      );
    }

    // Make sure user is booking owner, service provider, or admin
    if (
      booking.user._id.toString() !== req.user.id &&
      booking.serviceProvider._id.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to view this booking`,
          403
        )
      );
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new booking
// @route   POST /api/v1/bookings
// @access  Private
exports.createBooking = async (req, res, next) => {
  try {
    console.log('=== Booking Creation Debug ===');
    console.log('1. Received booking request:', JSON.stringify(req.body, null, 2));
    console.log('2. User from request:', JSON.stringify(req.user, null, 2));

    // Add user to req.body
    req.body.user = req.user.id;
    console.log('3. Updated booking request with user:', JSON.stringify(req.body, null, 2));

    // Validate required fields
    const requiredFields = ['serviceProvider', 'services', 'date', 'time', 'totalPrice'];
    console.log('4. Checking required fields:', requiredFields);
    
    for (const field of requiredFields) {
      console.log(`5. Checking field ${field}:`, req.body[field]);
      if (!req.body[field]) {
        console.log(`6. Missing required field: ${field}`);
        return res.status(400).json({
          success: false,
          message: `Missing required field: ${field}`,
          receivedData: req.body
        });
      }
    }

    // Validate services array
    console.log('7. Validating services array:', req.body.services);
    if (!Array.isArray(req.body.services) || req.body.services.length === 0) {
      console.log('8. Invalid services array:', req.body.services);
      return res.status(400).json({
        success: false,
        message: 'At least one service is required',
        receivedData: req.body
      });
    }

    // Validate each service
    console.log('9. Validating individual services');
    for (const service of req.body.services) {
      console.log('10. Validating service:', service);
      if (!service.name || !service.price || !service.duration) {
        console.log('11. Invalid service:', service);
        return res.status(400).json({
          success: false,
          message: 'Each service must have name, price, and duration',
          receivedData: req.body
        });
      }
    }

    // Check if the time slot is already booked
    console.log('12. Checking for existing bookings');
    const existingBooking = await Booking.findOne({
      serviceProvider: req.body.serviceProvider,
      date: new Date(req.body.date),
      time: req.body.time,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (existingBooking) {
      console.log('13. Time slot already booked:', existingBooking);
      return res.status(400).json({
        success: false,
        message: 'This time slot is already booked',
        receivedData: req.body
      });
    }

    // Create the booking
    console.log('14. Creating booking with data:', JSON.stringify(req.body, null, 2));
    const booking = await Booking.create(req.body);
    console.log('15. Booking created successfully:', JSON.stringify(booking, null, 2));

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking
    });
  } catch (err) {
    console.error('16. Booking creation error:', err);
    if (err.name === 'ValidationError') {
      console.error('17. Validation error details:', err.errors);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(err.errors).map(e => e.message),
        receivedData: req.body
      });
    }
    next(err);
  }
};

// @desc    Update booking
// @route   PUT /api/v1/bookings/:id
// @access  Private
exports.updateBooking = async (req, res, next) => {
  try {
    let booking = await Booking.findById(req.params.id);

    if (!booking) {
      return next(
        new ErrorResponse(`Booking not found with id of ${req.params.id}`, 404)
      );
    }

    // Make sure user is booking owner, service provider, or admin
    if (
      booking.user.toString() !== req.user.id &&
      booking.serviceProvider.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to update this booking`,
          403
        )
      );
    }

    booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Booking updated successfully',
      data: booking
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete booking
// @route   DELETE /api/v1/bookings/:id
// @access  Private
exports.deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return next(
        new ErrorResponse(`Booking not found with id of ${req.params.id}`, 404)
      );
    }

    // Make sure user is booking owner, service provider, or admin
    if (
      booking.user.toString() !== req.user.id &&
      booking.serviceProvider.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to delete this booking`,
          403
        )
      );
    }

    await booking.remove();

    res.status(200).json({
      success: true,
      message: 'Booking deleted successfully'
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update booking status
// @route   PATCH /api/v1/bookings/:id/status
// @access  Private
exports.updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return next(new ErrorResponse('Invalid status value', 400));
    }

    let booking = await Booking.findById(req.params.id);

    if (!booking) {
      return next(
        new ErrorResponse(`Booking not found with id of ${req.params.id}`, 404)
      );
    }

    // Make sure user is booking owner, service provider, or admin
    if (
      booking.user.toString() !== req.user.id &&
      booking.serviceProvider.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to update this booking`,
          403
        )
      );
    }

    booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: Date.now() },
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      message: 'Booking status updated successfully',
      data: {
        id: booking._id,
        status: booking.status,
        updatedAt: booking.updatedAt
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get bookings for a service provider
// @route   GET /api/v1/bookings/provider
// @access  Private
exports.getProviderBookings = async (req, res, next) => {
  try {
    // Get bookings where the service provider is the current user
    console.log(req.params.id);
    const bookings = await Booking.find({ serviceProvider: req.params.id })
      .populate({
        path: 'user',
        select: 'name email phone'
      })
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      data: bookings
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Check availability for a service provider
// @route   GET /api/v1/bookings/check-availability/:id
// @access  Private
exports.checkAvailability = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { date } = req.query;

    // Get all bookings for the service provider on the given date
    const bookings = await Booking.find({
      serviceProvider: id,
      date: new Date(date),
      status: { $in: ['pending', 'confirmed'] }
    }).select('time status');

    // Get all available time slots
    const availableTimeSlots = [
      "09:00 AM", "10:00 AM", "11:00 AM", 
      "12:00 PM", "01:00 PM", "02:00 PM", 
      "03:00 PM", "04:00 PM"
    ];

    // Create response with availability status for each time slot
    const availability = availableTimeSlots.map(time => {
      const isBooked = bookings.some(booking => booking.time === time);
      return {
        time,
        isBooked,
        status: isBooked ? 'booked' : 'available'
      };
    });

    res.status(200).json({
      success: true,
      data: availability
    });
  } catch (err) {
    next(err);
  }
}; 
//change booking status
exports.changeBookingStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const booking = await Booking.findByIdAndUpdate(id, { status }, { new: true });

    res.status(200).json({
      success: true,
      message: 'Booking status updated successfully',
      data: booking
    });
  } catch (err) {
    next(err);
  }
};
