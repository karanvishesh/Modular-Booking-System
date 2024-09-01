import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    bookerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bookableEntityId: { type: mongoose.Schema.Types.ObjectId, ref: 'BookableEntity', required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
  });

export default bookingSchema