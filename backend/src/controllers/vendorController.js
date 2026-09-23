const Vendor = require('../models/Vendor');
const VendorEnquiry = require('../models/VendorEnquiry');

exports.getVendors = async (req, res, next) => {
  try {
    const { city, category } = req.query;
    let query = {};
    if (city) query.city = new RegExp(city, 'i');
    if (category) query.category = category;

    const vendors = await Vendor.find(query);
    res.json({ success: true, count: vendors.length, data: vendors });
  } catch (error) {
    next(error);
  }
};

exports.getVendorById = async (req, res, next) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) return res.status(404).json({ success: false, message: 'Vendor not found' });
    res.json({ success: true, data: vendor });
  } catch (error) {
    next(error);
  }
};

exports.createEnquiry = async (req, res, next) => {
  try {
    const { vendorId, message } = req.body;
    const enquiry = await VendorEnquiry.create({
      user: req.user.id,
      vendor: vendorId,
      message
    });
    res.status(201).json({ success: true, data: enquiry });
  } catch (error) {
    next(error);
  }
};

exports.getMyEnquiries = async (req, res, next) => {
  try {
    const enquiries = await VendorEnquiry.find({ user: req.user.id }).populate('vendor');
    res.json({ success: true, count: enquiries.length, data: enquiries });
  } catch (error) {
    next(error);
  }
};

exports.toggleShortlist = async (req, res, next) => {
  try {
    let enquiry = await VendorEnquiry.findOne({ _id: req.params.id, user: req.user.id });
    if (!enquiry) return res.status(404).json({ success: false, message: 'Enquiry not found' });
    
    enquiry.isShortlisted = !enquiry.isShortlisted;
    await enquiry.save();
    res.json({ success: true, data: enquiry });
  } catch (error) {
    next(error);
  }
};

exports.updateEnquiryStatus = async (req, res, next) => {
  try {
    const { status, quotedAmount } = req.body;
    let enquiry = await VendorEnquiry.findOne({ _id: req.params.id, user: req.user.id });
    if (!enquiry) return res.status(404).json({ success: false, message: 'Enquiry not found' });
    
    if (status) enquiry.status = status;
    if (quotedAmount !== undefined) enquiry.quotedAmount = quotedAmount;
    
    await enquiry.save();
    res.json({ success: true, data: enquiry });
  } catch (error) {
    next(error);
  }
};
