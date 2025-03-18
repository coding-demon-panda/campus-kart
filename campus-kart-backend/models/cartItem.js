const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartItemSchema = new Schema({
  student: { type: Schema.Types.ObjectId, ref: "Student", required: true },
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, default: 1, required: true },
}, { timestamps: true });

module.exports = mongoose.model("CartItem", cartItemSchema);
