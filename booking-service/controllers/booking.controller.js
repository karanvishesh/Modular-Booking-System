import expressAsyncHandler from 'express-async-handler';
import createModel from '../utils/createmodel.js';
import bookableEntitySchema from '../schema/bookableEntity.schema.js';
import bookingSchema from '../schema/booking.schema.js';
import mongoose from 'mongoose';

export const bookEntity = expressAsyncHandler(async (req, res) => {
  const { bookableEntityId, startTime, endTime } = req.body;
  const bookerId = req.user._id;
  const dbKey = req.dbKey;
  
  if (!bookableEntityId || !startTime || !endTime) {
    return res.status(400).json({ status: 400, message: "Missing required fields" });
  }

  const start = new Date(startTime);
  const end = new Date(endTime);

  if (end <= start) {
    return res.status(400).json({ status: 400, message: "End time must be after start time" });
  }

  let bookableEntityObjectId;
  try {
    bookableEntityObjectId = new mongoose.Types.ObjectId(bookableEntityId);
  } catch (error) {
    return res.status(400).json({ status: 400, message: "Invalid bookable entity ID" });
  }

  const BookableEntity = createModel(dbKey, 'BookableEntity', bookableEntitySchema);
  const Booking = createModel(dbKey, 'Booking', bookingSchema);

  let entity = await BookableEntity.findById(bookableEntityObjectId);
  if (!entity) {
    return res.status(404).json({ status: 404, message: "Bookable entity not found" });
  }

  if (entity.status !== 'available') {
    return res.status(400).json({ status: 400, message: "Bookable entity is not available" });
  }

  const overlappingBookings = await Booking.find({
    bookableEntityId: bookableEntityObjectId,
    $or: [
      { startTime: { $lt: end }, endTime: { $gt: start } },
      { endTime: { $gt: start }, startTime: { $lt: end } }
    ]
  });

  if (overlappingBookings.length > 0) {
    return res.status(400).json({ status: 400, message: "The entity is already booked during the requested time" });
  }

  const newBooking = await Booking.create({ bookerId, bookableEntityId: bookableEntityObjectId, startTime, endTime });

  entity.status = 'booked';
  entity.bookingId = newBooking._id;
  await entity.save();

  res.status(201).json({
    status: 201,
    data: newBooking,
    message: "Entity booked successfully"
  });
});

export const getAllBookableEntities = expressAsyncHandler(async (req, res) => {
  const dbKey = req.dbKey;
  const BookableEntity = createModel(dbKey, 'BookableEntity', bookableEntitySchema);

  const entities = await BookableEntity.find();

  res.status(200).json({
    status: 200,
    data: entities,
    message: "Bookable entities fetched successfully"
  });
});

export const getAvailableEntities = expressAsyncHandler(async (req, res) => {
  const dbKey = req.dbKey;
  const BookableEntity = createModel(dbKey, 'BookableEntity', bookableEntitySchema);

  const availableEntities = await BookableEntity.find({ status: 'available' });

  res.status(200).json({
    status: 200,
    data: availableEntities,
    message: "Available entities fetched successfully"
  });
});

export const cancelBooking = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const dbKey = req.dbKey;

  if (!id) {
    return res.status(400).json({ error: "Booking ID is required" }); 
  }

  const BookableEntity = createModel(dbKey, 'BookableEntity', bookableEntitySchema);
  const Booking = createModel(dbKey, 'Booking', bookingSchema);

  const bookingObject = await Booking.findById(id);
  if (!bookingObject) {
    return res.status(404).json({ error: "Booking doesn't exist" });
  }

  const entity = await BookableEntity.findById(bookingObject.bookableEntityId);
  if (!entity) {
    return res.status(404).json({ error: "Entity doesn't exist" }); 
  }

  entity.status = "available";
  await entity.save();

  await Booking.deleteOne({ _id: id });

  res.status(200).json({
    status: 200,
    data: {},
    message: "Booking cancelled successfully"
  });
});

export const getBookingDetails = expressAsyncHandler(async (req, res) => {
  const { id } = req.params; 
  const dbKey = req.dbKey;
  
  let bookingDetails;
  try {
    const Booking = createModel(dbKey, 'Booking', bookingSchema);
    
    bookingDetails = await Booking.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      { 
        $lookup: {
          from: 'users',
          localField: 'bookerId',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: 1,
          startTime: 1,
          endTime: 1,
          'user.username': 1
        }
      }
    ]);
  } catch (error) {
    return res.status(400).json({ status: 400, message: "Invalid booking ID" });
  }

  if (bookingDetails.length === 0) {
    return res.status(404).json({
      status: 404,
      message: "Booking not found"
    });
  }

  const booking = bookingDetails[0];

  res.status(200).json({
    status: 200,
    data: {
      bookingId: booking._id,
      bookedBy: booking.user.username,
      startTime: booking.startTime,
      endTime: booking.endTime
    },
    message: "Booking details fetched successfully"
  });
});

export const updateBooking = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const { startTime, endTime } = req.body;
  const dbKey = req.dbKey;
  
  const Booking = createModel(dbKey, 'Booking', bookingSchema);
  const BookableEntity = createModel(dbKey, 'BookableEntity', bookableEntitySchema);

  const booking = await Booking.findById(id);
  if (!booking) {
    return res.status(404).json({ status: 404, message: "Booking not found" });
  }

  const entity = await BookableEntity.findById(booking.bookableEntityId);
  if (!entity) {
    return res.status(404).json({ status: 404, message: "Bookable entity not found" });
  }

  const newStartTime = startTime || booking.startTime;
  const newEndTime = endTime || booking.endTime;

  if (newEndTime <= newStartTime) {
    return res.status(400).json({ status: 400, message: "End time must be after start time" });
  }

  const overlappingBookings = await Booking.find({
    bookableEntityId: booking.bookableEntityId,
    _id: { $ne: id },
    $or: [
      { startTime: { $lt: newEndTime }, endTime: { $gt: newStartTime } },
      { endTime: { $gt: newStartTime }, startTime: { $lt: newEndTime } }
    ]
  });

  if (overlappingBookings.length > 0) {
    return res.status(400).json({ status: 400, message: "The entity is already booked during the requested time" });
  }

  booking.startTime = newStartTime;
  booking.endTime = newEndTime;

  await booking.save();

  res.status(200).json({
    status: 200,
    data: booking,
    message: "Booking updated successfully"
  });
});
