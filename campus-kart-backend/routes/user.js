const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");

// Registration Route
router.post(
  "/registration",
  [
    body("organisationName").notEmpty().withMessage("Organisation Name is required"),
    body("userName").notEmpty().withMessage("User Name is required"),
    body("userEmailId").isEmail().withMessage("Valid Email is required"),
    body("userPhoneNumberCountryCode").notEmpty().withMessage("Country Code is required"),
    body("userPhoneNumber").notEmpty().withMessage("Phone Number is required"),
    body("userPassword")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { organisationName, userName, userEmailId, userPhoneNumberCountryCode, userPhoneNumber, userPassword } = req.body;

    try {
      // Check if user already exists
      let user = await User.findOne({ userEmailId });
      if (user) {
        return res.status(400).json({ message: "User already registered" });
      }

      // Create new user
      user = new User({
        organisationName,
        userName,
        userEmailId,
        userPhoneNumberCountryCode,
        userPhoneNumber,
        userPassword: userPassword,
      });

      await user.save();

      // Generate JWT token, including the seller's ID in the payload (using key 'id')
      const token = jwt.sign(
        { id: user._id, roles: ["ADMIN"], sub: userEmailId },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      res.status(201).json({
        organisationName: user.organisationName,
        organisationUrl: `https://${organisationName.toLowerCase().replace(/\s+/g, "-")}.campus-kart-frontend.vercel.app`,
        // organisationUrl: `http://${organisationName.toLowerCase().replace(/\s+/g, "-")}.localhost:3000`,
        adminName: user.userName,
        token,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server Error" });
    }
  }
);

// Login Route
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
    body("organisationCname").notEmpty().withMessage("Organisation Cname is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, organisationCname } = req.body;

    try {
      // 1️⃣ Check if user exists
      const user = await User.findOne({ userEmailId: email });

      if (!user) {
        console.log("❌ User not found for email:", email);
        return res.status(400).json({ message: "Invalid email or password" });
      }

      // 2️⃣ Compare password with hashed password in DB
      const isMatch = await bcrypt.compare(password, user.userPassword);
      console.log("🔍 Entered Password:", password);
      console.log("🔍 Stored Hashed Password:", user.userPassword);
      
      if (!isMatch) {
        console.log("❌ Incorrect password for email:", email);
        return res.status(400).json({ message: "Invalid email or password" });
      }

      // 3️⃣ Ensure organisationCname matches the stored organisation
      const expectedOrgCname = user.organisationName.toLowerCase().replace(/\s+/g, "-");
      if (expectedOrgCname !== organisationCname) {
        console.log(`❌ Organisation mismatch. Expected: ${expectedOrgCname}, Got: ${organisationCname}`);
        return res.status(400).json({ message: "Invalid organisation Cname" });
      }

      // 4️⃣ Generate JWT token
      const token = jwt.sign(
        { id: user._id, roles: ["ADMIN"], sub: email },
        process.env.JWT_SECRET,
        { expiresIn: "2h" }
      );      

      console.log(`✅ Login successful for: ${email}`);

      res.status(200).json({
        username: user.userName,
        role: "ADMIN",
        token,
        expiresIn: 120000000, // 20 minutes in milliseconds
        organisationUrl: `https://${organisationCname}.campus-kart-frontend.vercel.app`,
        // organisationUrl: `http://${organisationCname}.localhost:3000`,
        organisationReferenceId: user._id, // MongoDB ObjectId as Reference ID
      });

    } catch (err) {
      console.error("🔥 Server error during login:", err);
      res.status(500).json({ message: "Server Error" });
    }
  }
);

module.exports = router;
