const mongoose = require('mongoose');
const { orderSchema } = require('../Schemas/OrderSchema');

const Order = mongoose.model("Order", orderSchema);

module.exports = { Order };
