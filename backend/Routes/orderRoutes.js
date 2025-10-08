const express = require("express");
const OrderRouter = express.Router();
const { placeOrder, createRazorpayOrder, verifyRazorpayPayment,testWhatsApp } = require("../Controllers/Order.controller");
const {verifyUser} = require("../Middlewares/verifyUserMiddleware");

OrderRouter.post("/place-order", verifyUser, placeOrder);
OrderRouter.post("/create-razorpay-order", verifyUser, createRazorpayOrder);
OrderRouter.post("/verify-razorpay-payment", verifyUser, verifyRazorpayPayment);
OrderRouter.get("/test-whatsapp", testWhatsApp);

module.exports = OrderRouter;