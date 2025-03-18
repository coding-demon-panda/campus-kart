const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const studentSchema = new mongoose.Schema(
  {
    studentName: { type: String, required: true },
    studentEmail: { type: String, required: true, unique: true },
    collegeId: { type: String, required: true },
    studentPassword: { type: String, required: true },
  },
  { timestamps: true }
);

// Hash the password before saving the student document
studentSchema.pre("save", async function (next) {
  if (!this.isModified("studentPassword")) return next();
  const salt = await bcrypt.genSalt(10);
  this.studentPassword = await bcrypt.hash(this.studentPassword, salt);
  next();
});

// Method to compare provided password with the hashed password
studentSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.studentPassword);
};

const Student = mongoose.model("Student", studentSchema);
module.exports = Student;
