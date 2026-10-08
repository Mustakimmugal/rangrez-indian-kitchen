import 'dotenv/config';
import mongoose from 'mongoose';
import MenuItem from './models/MenuItem.js';
import { menuItems } from './data/menu.js';

if (!process.env.MONGODB_URI) {
  console.error('Set MONGODB_URI in backend/.env before seeding the menu.');
  process.exitCode = 1;
} else {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const operations = menuItems.map(({ _id, ...item }) => ({
      updateOne: { filter: { name: item.name }, update: { $set: item }, upsert: true },
    }));
    const result = await MenuItem.bulkWrite(operations);
    console.log(`Menu seeded. ${result.upsertedCount} new dishes, ${result.modifiedCount} updated.`);
  } catch (error) {
    console.error(`Could not seed the menu: ${error.message}`);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}
