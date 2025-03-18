const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const verifyJWT = require('../middleware/verifyJWT');

// GET /seller/products - Returns all products uploaded by the authenticated seller
router.get('/products', verifyJWT, async (req, res) => {
  try {
    // Access the seller's id from the JWT payload (assumed to be stored under "id")
    const sellerId = req.user.id;
    const products = await Product.find({ owner: sellerId });
    res.status(200).json({ products });
  } catch (error) {
    console.error("Error fetching seller products:", error);
    res.status(500).json({ message: "Server error fetching products" });
  }
});

// POST /seller/products - Add a new product
router.post('/products', verifyJWT, async (req, res) => {
  try {
    // Retrieve seller's id from the JWT payload (attached to req.user by the verifyJWT middleware)
    const sellerId = req.user.id;

    // Destructure the product details from the request body
    const { name, description, price, imageUrl } = req.body;

    // Validate required fields
    if (!name || !price) {
      return res.status(400).json({ message: "Name and Price are required." });
    }

    // Create a new product with the owner set to the seller's id
    const newProduct = new Product({
      name,
      description,
      price,
      imageUrl,
      owner: sellerId
    });

    // Save the product in the database
    await newProduct.save();

    res.status(201).json({
      message: "Product added successfully",
      product: newProduct
    });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: "Server error while adding product" });
  }
});

// DELETE /seller/products/:id - Delete a product
router.delete('/products/:id', verifyJWT, async (req, res) => {
  try {
    const sellerId = req.user.id; // Extracted from the verified JWT payload
    const productId = req.params.id;

    // Find the product by its ID
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Ensure the product belongs to the authenticated seller
    if (product.owner.toString() !== sellerId) {
      return res.status(403).json({ message: "Unauthorized: You cannot delete this product" });
    }

    // Delete the product from the database
    await Product.findByIdAndDelete(productId);

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Server error while deleting product" });
  }
});

// PUT /seller/products/:id - Edit an existing product
router.put('/products/:id', verifyJWT, async (req, res) => {
  try {
    const sellerId = req.user.id; // Extract seller's id from the JWT payload
    const productId = req.params.id;
    const { name, description, price, imageUrl } = req.body;

    // Find the product by its ID
    let product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check that the product belongs to the authenticated seller
    if (product.owner.toString() !== sellerId) {
      return res.status(403).json({ message: "Unauthorized: You cannot edit this product" });
    }

    // Update product fields if provided
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (imageUrl) product.imageUrl = imageUrl;

    // Save updated product
    await product.save();

    res.status(200).json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Server error while updating product" });
  }
});

module.exports = router;
