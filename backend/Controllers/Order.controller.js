const { Order } = require("../Models/OrderModel");
const twilio = require("twilio");

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

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

module.exports = { placeOrder };