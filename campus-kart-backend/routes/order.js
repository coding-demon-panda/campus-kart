const express = require("express");
const router = express.Router();
const Order = require("../models/order");
const CartItem = require("../models/cartItem"); // Import the CartItem model
const verifyJWT = require("../middleware/verifyJWT");

// GET /orders - Get all orders for the authenticated student
router.get('/', verifyJWT, async (req, res) => {
    try {
        const studentId = req.user.id; // student id from JWT
        const orders = await Order.find({ student: studentId })
        .populate("cartItems.product", "name price imageUrl description")
        .sort({ createdAt: -1 });
        res.status(200).json({ orders });
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ message: "Server error fetching orders" });
    }
});

// POST /order - Create a new order and clear the cart
router.post("/", verifyJWT, async (req, res) => {
  try {
    const studentId = req.user.id; // Ensure your JWT payload includes the student's id as 'id'
    const { cartItems, totalPrice, paymentMethod, address, deliverySlot, estimatedDeliveryDate } = req.body;
    
    // Validate required fields
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ message: "Cart items are required" });
    }
    if (!totalPrice || !paymentMethod) {
      return res.status(400).json({ message: "Total price and payment method are required" });
    }

    // Create new order
    const newOrder = new Order({
      student: studentId,
      cartItems,
      totalPrice,
      paymentMethod,
      address,
      deliverySlot,
      estimatedDeliveryDate,
      orderStatus: "Pending",
    });

    await newOrder.save();

    // Clear the student's cart
    await CartItem.deleteMany({ student: studentId });

    res.status(201).json({ message: "Order created successfully", orderId: newOrder._id });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Server error while creating order" });
  }
});

module.exports = router;
