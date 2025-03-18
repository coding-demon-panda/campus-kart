const express = require('express');
const router = express.Router();
const Product = require('../models/product');

// GET /products - Get all products from all sellers
router.get('/', async (req, res) => {
  try {
    // Optionally populate seller info (e.g., organisationName)
    const products = await Product.find({}).populate("owner", "organisationName");
    res.status(200).json({ products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server error fetching products" });
  }
});

module.exports = router;
