import { Router } from 'express';
import mongoose from 'mongoose';
import MenuItem from './models/MenuItem.js';
import Reservation from './models/Reservation.js';
import Subscriber from './models/Subscriber.js';
import { menuItems } from './data/menu.js';

const router = Router();
const demoReservations = [];
const demoSubscribers = new Set();
const connectedToMongo = () => mongoose.connection.readyState === 1;

router.get('/health', (_req, res) => res.json({ ok: true, database: connectedToMongo() ? 'mongodb' : 'demo' }));

router.get('/menu', async (req, res, next) => {
  try {
    const filter = req.query.category && req.query.category !== 'All' ? { category: req.query.category } : {};
    const items = connectedToMongo() ? await MenuItem.find(filter).sort({ category: 1, name: 1 }).lean() : menuItems.filter((item) => !filter.category || item.category === filter.category);
    res.json(items);
  } catch (error) { next(error); }
});

router.post('/reservations', async (req, res, next) => {
  try {
    const { name, email, phone, date, time, guests, occasion = '', offerCode = '', notes = '' } = req.body || {};
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    const bookingDate = typeof date === 'string' ? date : '';
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);
    const parsedGuests = Number(guests);
    const normalizedOfferCode = String(offerCode).trim().toUpperCase();
    if (!name?.trim() || !validEmail || !phone?.trim() || !/^\d{4}-\d{2}-\d{2}$/.test(bookingDate) || !time || !Number.isInteger(parsedGuests) || parsedGuests < 1 || parsedGuests > 12) {
      return res.status(400).json({ message: 'Please add your name, a valid email and phone number, a date, time, and a party size from 1 to 12.' });
    }
    const indiaDateParts = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
    const indiaPart = (type) => indiaDateParts.find((part) => part.type === type)?.value;
    const today = `${indiaPart('year')}-${indiaPart('month')}-${indiaPart('day')}`;
    if (bookingDate < today) return res.status(400).json({ message: 'Please choose today or a future date.' });
    if (normalizedOfferCode && normalizedOfferCode !== 'RANGREZ15') return res.status(400).json({ message: 'That offer code is not valid. Check the code and try again.' });
    const [bookingYear, bookingMonth, bookingDay] = bookingDate.split('-').map(Number);
    const bookingWeekday = new Date(Date.UTC(bookingYear, bookingMonth - 1, bookingDay)).getUTCDay();
    if (normalizedOfferCode === 'RANGREZ15' && ![1, 2, 3, 4].includes(bookingWeekday)) {
      return res.status(400).json({ message: 'RANGREZ15 is valid for Monday–Thursday bookings.' });
    }
    const record = { name: name.trim(), email: normalizedEmail, phone: phone.trim(), date: bookingDate, time: String(time), guests: parsedGuests, occasion: String(occasion).slice(0, 80), offerCode: normalizedOfferCode, notes: String(notes).slice(0, 1000), status: 'pending' };
    const saved = connectedToMongo() ? await Reservation.create(record) : { ...record, _id: `demo-${Date.now()}`, createdAt: new Date().toISOString() };
    if (!connectedToMongo()) demoReservations.push(saved);
    res.status(201).json({ message: 'Reservation request received.', reservation: { id: saved._id, date: saved.date, time: saved.time, guests: saved.guests, status: saved.status } });
  } catch (error) { next(error); }
});

router.post('/newsletter', async (req, res, next) => {
  try {
    const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ message: 'Please enter a valid email address.' });
    if (connectedToMongo()) {
      const existing = await Subscriber.findOne({ email });
      if (existing) return res.status(200).json({ message: 'You are already on the list.' });
      await Subscriber.create({ email });
    } else {
      if (demoSubscribers.has(email)) return res.status(200).json({ message: 'You are already on the list.' });
      demoSubscribers.add(email);
    }
    res.status(201).json({ message: 'You are on the list.' });
  } catch (error) {
    if (error.code === 11000) return res.status(200).json({ message: 'You are already on the list.' });
    next(error);
  }
});

export default router;
