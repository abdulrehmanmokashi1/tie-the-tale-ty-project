const WeddingEvent = require('../models/WeddingEvent');

exports.getEvents = async (req, res, next) => {
  try {
    const events = await WeddingEvent.find({ user: req.user.id }).sort('date');
    res.json({ success: true, data: events });
  } catch (error) {
    next(error);
  }
};

exports.createEvent = async (req, res, next) => {
  try {
    const data = { ...req.body, user: req.user.id };
    const event = await WeddingEvent.create(data);
    res.status(201).json({ success: true, data: event });
  } catch (error) {
    next(error);
  }
};

exports.updateEvent = async (req, res, next) => {
  try {
    let event = await WeddingEvent.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    if (event.user.toString() !== req.user.id) return res.status(403).json({ success: false, message: 'Unauthorized' });
    
    event = await WeddingEvent.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, data: event });
  } catch (error) {
    next(error);
  }
};

exports.deleteEvent = async (req, res, next) => {
  try {
    const event = await WeddingEvent.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    if (event.user.toString() !== req.user.id) return res.status(403).json({ success: false, message: 'Unauthorized' });
    
    await event.deleteOne();
    res.json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
