const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/', profileController.getProfile);
router.post('/', profileController.createOrUpdateProfile);
router.post('/wishlist/:venueId', profileController.toggleWishlistVenue);

module.exports = router;
