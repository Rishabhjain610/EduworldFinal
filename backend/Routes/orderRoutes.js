const express = require("express");
const OrderRouter = express.Router();
const { placeOrder } = require("../Controllers/Order.controller");
const {verifyUser} = require("../Middlewares/verifyUserMiddleware");

OrderRouter.post("/place-order", verifyUser, placeOrder);

module.exports = OrderRouter;