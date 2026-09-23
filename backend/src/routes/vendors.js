const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendorController');
const auth = require('../middleware/auth');

router.get('/', vendorController.getVendors);
router.get('/:id', vendorController.getVendorById);

router.post('/enquiry', auth, vendorController.createEnquiry);
router.get('/my-enquiries', auth, vendorController.getMyEnquiries);
router.put('/enquiry/:id/shortlist', auth, vendorController.toggleShortlist);
router.put('/enquiry/:id/status', auth, vendorController.updateEnquiryStatus);

module.exports = router;
