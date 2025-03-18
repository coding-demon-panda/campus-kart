const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const Student = require("../models/student");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Student Registration Route
router.post(
  "/register",
  [
    body("studentName").notEmpty().withMessage("Student Name is required"),
    body("studentEmail").isEmail().withMessage("Valid email is required"),
    body("collegeId").notEmpty().withMessage("College ID is required"),
    body("studentPassword")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { studentName, studentEmail, collegeId, studentPassword } = req.body;

    try {
      // Check if a student with the given email already exists
      let student = await Student.findOne({ studentEmail });
      if (student) {
        return res.status(400).json({ message: "Student already registered" });
      }

      // Create a new student document
      student = new Student({
        studentName,
        studentEmail,
        collegeId,
        studentPassword,
      });

      await student.save();

      // Generate JWT token including the student's id
      const token = jwt.sign(
        { id: student._id, roles: ["STUDENT"], sub: studentEmail },
        process.env.JWT_SECRET,
        { expiresIn: "2h" }
      );

      res.status(201).json({
        studentName: student.studentName,
        token,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server Error" });
    }
  }
);

// Student Login Route
router.post(
  "/login",
  [
    body("studentEmail").isEmail().withMessage("Valid email is required"),
    body("studentPassword").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
      return res.status(400).json({ errors: errors.array() });
    }

    const { studentEmail, studentPassword } = req.body;

    try {
      const student = await Student.findOne({ studentEmail });
      if (!student) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      const isMatch = await student.comparePassword(studentPassword);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      // Generate JWT token for the student
      const token = jwt.sign(
        { id: student._id, roles: ["STUDENT"], sub: studentEmail },
        process.env.JWT_SECRET,
        { expiresIn: "2h" }
      );

      res.status(200).json({
        studentName: student.studentName,
        token,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server Error" });
    }
  }
);

module.exports = router;
