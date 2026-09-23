const mongoose = require('mongoose');

const weddingEventSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  eventType: { type: String, enum: ['Haldi','Mehendi','Sangeet','Nikah','Wedding','Reception'], required: true },
  date: Date,
  time: String,
  venueName: String,
  guestCount: Number,
  status: { type: String, enum: ['Planned','Confirmed','Done'], default: 'Planned' },
  notes: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('WeddingEvent', weddingEventSchema);
