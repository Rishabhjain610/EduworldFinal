const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    orderNumber: { type: String, required: true, unique: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
        {
            name: { type: String },
            quantity: { type: Number },
            price: { type: Number }
        }
    ],
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ["placed", "in preparation", "ready"], default: "placed" },
    createdAt: { type: Date, default: Date.now },
});

module.exports = { orderSchema };
