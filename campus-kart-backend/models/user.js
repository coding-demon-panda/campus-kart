const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    organisationName: { type: String, required: true },
    userName: { type: String, required: true },
    userEmailId: { type: String, required: true, unique: true },
    userPhoneNumberCountryCode: { type: String, required: true },
    userPhoneNumber: { type: String, required: true },
    userPassword: { type: String, required: true },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("userPassword")) return next();
  const salt = await bcrypt.genSalt(10);
  this.userPassword = await bcrypt.hash(this.userPassword, salt);
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
