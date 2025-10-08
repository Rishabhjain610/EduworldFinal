const mongoose = require("mongoose");
const {Schema, model} = mongoose;

const orderSchema = new Schema({
  orderNumber: { type: String, required: true, unique: true },
  student: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      name: { type: String },
      quantity: { type: Number },
      price: { type: Number },
    },
  ],
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ["placed", "in preparation", "ready", "completed"],
    default: "placed",
  },
  paymentDetails: {
    razorpay_order_id: String,
    razorpay_payment_id: String,
    razorpay_signature: String,
    payment_method: { type: String, default: "Cash" }
  },
  createdAt: { type: Date, default: Date.now },
});

const Order = model("Order", orderSchema);

module.exports = { Order };