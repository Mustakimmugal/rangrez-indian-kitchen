import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, lowercase: true, trim: true, maxlength: 254 },
  phone: { type: String, required: true, trim: true, maxlength: 40 },
  date: { type: String, required: true },
  time: { type: String, required: true },
  guests: { type: Number, required: true, min: 1, max: 12 },
  occasion: { type: String, default: '', maxlength: 80 },
  offerCode: { type: String, default: '', uppercase: true, trim: true, maxlength: 24 },
  notes: { type: String, default: '', maxlength: 1000 },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
}, { timestamps: true });

export default mongoose.model('Reservation', reservationSchema);
