import mongoose from 'mongoose';

const bookableEntitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  status: { type: String, enum: ['available', 'booked'], default: 'available' },
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }
});

export default bookableEntitySchema