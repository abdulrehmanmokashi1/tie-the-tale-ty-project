const mongoose = require('mongoose');

const venueSchema = new mongoose.Schema({
  name: { type: String, required: true },
  city: { type: String, required: true },
  type: String,
  description: String,
  capacity: Number,
  pricePerDay: Number,
  photos: [String],
  facilities: [String],
  location: String,
  rating: { type: Number, default: 4.0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Venue', venueSchema);
