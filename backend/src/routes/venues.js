const express = require('express');
const router = express.Router();
const venueController = require('../controllers/venueController');

router.get('/', venueController.getVenues);
router.get('/:id', venueController.getVenueById);

module.exports = router;
