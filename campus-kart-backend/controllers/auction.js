const express = require('express');
const router = express.Router();
const Listing = require('../models/listing.js'); // Adjust the path according to your structure

module.exports.startAuction = async (req, res) => {
    const selectedItems = req.body.selectedItems ? req.body.selectedItems.split(',') : [];
    console.log('Selected Items:', selectedItems);

    try {
        const listings = await Listing.find({ _id: { $in: selectedItems } });
        console.log(listings);

        // Simulate vendor responses
        const vendorQuotes = listings.map(listing => ({
            title: listing.title,
            quotes: {
                Github: Math.floor(Math.random() * (50 - 30 + 1)) + 30,
                Gitlab: Math.floor(Math.random() * (60 - 40 + 1)) + 40,
                Bitbucket: Math.floor(Math.random() * (70 - 50 + 1)) + 50   
            }
        }));

        // Render the auction quotes page
        res.render('auctionQuotes', { quotes: vendorQuotes });
    } catch (error) {
        console.error('Error starting auction:', error);
        res.status(500).json({ message: 'Error starting auction' });
    }
};

module.exports.acceptQuote = async (req, res) => {
    const { selectedItems, acceptedQuote } = req.body;

    try {
        // Here you can implement your payment processing logic
        // For example, using a payment gateway API like Stripe, PayPal, etc.

        // Simulating successful payment processing
        console.log(`Payment successful for items: ${selectedItems} with accepted quote: $${acceptedQuote}`);
        
        // Redirecting to a success page or back to listings
        res.redirect('/success'); // Replace with your success page route
    } catch (error) {
        console.error('Error processing payment:', error);
        res.status(500).send('Error processing payment');
    }
};