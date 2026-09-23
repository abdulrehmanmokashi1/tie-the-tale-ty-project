const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  city: { type: String, required: true },
  category: { type: String, enum: ['Photographer','Decorator','Caterer','Makeup Artist','DJ','Mehendi Artist','Transport'], required: true },
  description: String,
  startingPrice: Number,
  photos: [String],
  contactEmail: String,
  contactPhone: String,
  rating: { type: Number, default: 4.0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Vendor', vendorSchema);
