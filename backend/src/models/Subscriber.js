import mongoose from 'mongoose';

const subscriberSchema = new mongoose.Schema({
  email: { type: String, required: true, lowercase: true, trim: true, unique: true, maxlength: 254 },
}, { timestamps: true });

export default mongoose.model('Subscriber', subscriberSchema);
