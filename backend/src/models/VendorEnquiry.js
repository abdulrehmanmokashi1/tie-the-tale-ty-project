const mongoose = require('mongoose');

const vendorEnquirySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  message: String,
  status: { type: String, enum: ['Enquired','Quoted','Booked','Paid'], default: 'Enquired' },
  quotedAmount: Number,
  isShortlisted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('VendorEnquiry', vendorEnquirySchema);
