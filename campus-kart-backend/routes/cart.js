const express = require("express");
const router = express.Router();
const CartItem = require("../models/cartItem");
const verifyJWT = require("../middleware/verifyJWT");

// GET /cart - Retrieve all cart items for the authenticated student
router.get("/", verifyJWT, async (req, res) => {
  try {
    const studentId = req.user.id;
    // Populate product details (you can adjust which fields to populate)
    const cartItems = await CartItem.find({ student: studentId })
      .populate("product", "name description price imageUrl");
    res.status(200).json({ cartItems });
  } catch (error) {
    console.error("Error fetching cart items:", error);
    res.status(500).json({ message: "Server error fetching cart items" });
  }
});

// POST /cart - Add an item to the cart
router.post("/", verifyJWT, async (req, res) => {
  try {
    const studentId = req.user.id;
    const { product, quantity } = req.body;
    if (!product) {
      return res.status(400).json({ message: "Product is required" });
    }
    const cartItem = new CartItem({
      student: studentId,
      product,
      quantity: quantity || 1,
    });
    await cartItem.save();
    res.status(201).json({ message: "Item added to cart", cartItem });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Server error adding to cart" });
  }
});

// PUT /cart/:id - Edit/update a cart item (change quantity)
router.put("/:id", verifyJWT, async (req, res) => {
  try {
    const studentId = req.user.id;
    const cartItemId = req.params.id;
    const { quantity } = req.body;
    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: "Invalid quantity" });
    }
    const cartItem = await CartItem.findById(cartItemId);
    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }
    if (cartItem.student.toString() !== studentId) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    cartItem.quantity = quantity;
    await cartItem.save();
    res.status(200).json({ message: "Cart item updated", cartItem });
  } catch (error) {
    console.error("Error updating cart item:", error);
    res.status(500).json({ message: "Server error updating cart item" });
  }
});

// DELETE /cart/:id - Delete a cart item
router.delete("/:id", verifyJWT, async (req, res) => {
  try {
    const studentId = req.user.id;
    const cartItemId = req.params.id;
    const cartItem = await CartItem.findById(cartItemId);
    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }
    if (cartItem.student.toString() !== studentId) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    await CartItem.findByIdAndDelete(cartItemId);
    res.status(200).json({ message: "Cart item deleted" });
  } catch (error) {
    console.error("Error deleting cart item:", error);
    res.status(500).json({ message: "Server error deleting cart item" });
  }
});

module.exports = router;
