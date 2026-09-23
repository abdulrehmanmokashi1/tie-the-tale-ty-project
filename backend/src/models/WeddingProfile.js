const mongoose = require('mongoose');

const weddingProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  brideName: String,
  groomName: String,
  weddingDate: Date,
  destination: String,
  guestCount: Number,
  totalBudget: { type: Number, default: 0 },
  wishlistedVenues: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Venue' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('WeddingProfile', weddingProfileSchema);
