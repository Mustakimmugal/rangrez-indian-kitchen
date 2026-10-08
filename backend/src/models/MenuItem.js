import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  description: { type: String, required: true, trim: true },
  image: { type: String, default: '' },
  tag: { type: String, default: '' },
  dietary: [{ type: String }],
  featured: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('MenuItem', menuItemSchema);
