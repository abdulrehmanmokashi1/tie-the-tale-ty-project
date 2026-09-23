const Venue = require('../models/Venue');

exports.getVenues = async (req, res, next) => {
  try {
    const { city, minPrice, maxPrice, minCapacity } = req.query;
    let query = {};
    
    if (city) query.city = new RegExp(city, 'i');
    if (minPrice || maxPrice) {
      query.pricePerDay = {};
      if (minPrice) query.pricePerDay.$gte = Number(minPrice);
      if (maxPrice) query.pricePerDay.$lte = Number(maxPrice);
    }
    if (minCapacity) query.capacity = { $gte: Number(minCapacity) };

    const venues = await Venue.find(query);
    res.json({ success: true, count: venues.length, data: venues });
  } catch (error) {
    next(error);
  }
};

exports.getVenueById = async (req, res, next) => {
  try {
    const venue = await Venue.findById(req.params.id);
    if (!venue) return res.status(404).json({ success: false, message: 'Venue not found' });
    res.json({ success: true, data: venue });
  } catch (error) {
    next(error);
  }
};
