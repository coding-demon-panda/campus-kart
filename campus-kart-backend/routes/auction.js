const express = require('express');
const router = express.Router();
const Listing = require('../models/listing.js'); // Adjust the path according to your structure
const auctionController = require('../controllers/auction.js');

router.post('/start', auctionController.startAuction);

router.post('/accept', auctionController.acceptQuote);

module.exports = router;
