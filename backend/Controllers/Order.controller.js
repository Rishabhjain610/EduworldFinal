const { Order } = require("../Models/OrderModel");
const twilio = require("twilio");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay order
const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body; // amount in rupees
    const options = {
      amount: amount * 100, // amount in paise
      currency: "INR",
      receipt: "rcptid_" + Math.floor(Math.random() * 10000),
    };
    const order = await razorpay.orders.create(options);
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: "Razorpay order creation failed" });
  }
};

// Verify Razorpay payment and place order
const verifyRazorpayPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderDetails } = req.body;

  const sign = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  if (sign === razorpay_signature) {
    // Payment is verified, now place the order
    req.body = orderDetails; // set order details for placeOrder
    await placeOrder(req, res);
  } else {
    res.status(400).json({ success: false, message: "Payment verification failed" });
  }
};

const placeOrder = async (req, res) => {
  try {
    const user = req.user;
    if (user.role !== "student" || !user.phoneNumber) {
      return res.status(403).send("Only students with phone numbers can place orders.");
    }

    const orderNumber = "ORD" + Math.floor(100000 + Math.random() * 900000);
    const totalAmount = req.body.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const newOrder = new Order({
      orderNumber,
      student: user._id,
      items: req.body.items,
      totalAmount,
      status: "placed"
    });

    await newOrder.save();

    // Send "Order Placed" WhatsApp
    await client.messages.create({
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_FROM}`,
      to: `whatsapp:${user.phoneNumber}`,
      body: `✅ Hi ${user.username}, your canteen order #${orderNumber} has been successfully placed. We’ll let you know once it's ready! 🍽️`
    });

    // Send "Order Ready" WhatsApp after 2 minutes
    setTimeout(async () => {
      try {
        await client.messages.create({
          from: `whatsapp:${process.env.TWILIO_WHATSAPP_FROM}`,
          to: `whatsapp:${user.phoneNumber}`,
          body: `📢 Your canteen order #${orderNumber} is now ready! Please collect it from the counter. Enjoy your meal! 🥤`
        });
        await Order.findOneAndUpdate({ orderNumber }, { status: "ready" });
      } catch (err) {
        console.error("Failed to send ready message:", err.message);
      }
    }, 2 * 60 * 1000);

    res.send("Order placed and confirmation sent via WhatsApp.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error placing order.");
  }
};

module.exports = { placeOrder, createRazorpayOrder, verifyRazorpayPayment };