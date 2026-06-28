// const { Order } = require("../Models/OrderModel");
// const twilio = require("twilio");
// const Razorpay = require("razorpay");
// const crypto = require("crypto");

// // Initialize Twilio client
// let client;
// try {
//   if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
//     client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
//   } else {
//     client = null;
//   }
// } catch (error) {
//   client = null;
// }

// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

// // Create Razorpay order
// const createRazorpayOrder = async (req, res) => {
//   try {
//     const { amount } = req.body;
    
//     const options = {
//       amount: amount * 100, // amount in paise
//       currency: "INR",
//       receipt: "rcptid_" + Math.floor(Math.random() * 10000),
//     };
    
//     const order = await razorpay.orders.create(options);
    
//     res.json({ success: true, order });
//   } catch (err) {
//     res.status(500).json({ success: false, message: "Razorpay order creation failed" });
//   }
// };

// // Verify Razorpay payment and place order
// const verifyRazorpayPayment = async (req, res) => {
//   try {
//     const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderDetails } = req.body;
//     const user = req.user;

//     // Create signature for verification
//     const sign = crypto
//       .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//       .update(razorpay_order_id + "|" + razorpay_payment_id)
//       .digest("hex");

//     if (sign === razorpay_signature) {
//       // Generate order number
//       const orderNumber = "EDU" + Math.floor(100000 + Math.random() * 900000);
//       const totalAmount = orderDetails.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

//       // Create order in database
//       const newOrder = new Order({
//         orderNumber,
//         student: user.id,
//         items: orderDetails.items,
//         totalAmount,
//         status: "placed",
//         paymentDetails: {
//           razorpay_order_id,
//           razorpay_payment_id,
//           razorpay_signature,
//           payment_method: "Razorpay"
//         }
//       });

//       await newOrder.save();

//       // Send WhatsApp based on user type
//       if (client) {
//         let phoneNumber;
//         let userType;

//         if (!user.password) {
//           // Google Auth user - use hardcoded number
//           phoneNumber = "+918433943227";
//           userType = "Google Auth User";
//         } else if (user.phoneNumber) {
//           // Regular user with phone number
//           phoneNumber = user.phoneNumber.startsWith('+') ? user.phoneNumber : `+91${user.phoneNumber}`;
//           userType = "Regular User";
//         } else {
//           phoneNumber = null;
//         }

//         if (phoneNumber) {
//           try {
//             // Create items list for WhatsApp
//             const itemsList = orderDetails.items.map(item => 
//               `• ${item.name} x${item.quantity} - ₹${item.price * item.quantity}`
//             ).join('\n');

//             // Send "Order Placed" WhatsApp
//             const placedMessage = await client.messages.create({
//               from: `whatsapp:${process.env.TWILIO_WHATSAPP_FROM}`,
//               to: `whatsapp:${phoneNumber}`,
//               body: `✅ Hi ${user.username || 'Customer'}, your EduWorld Canteen order #${orderNumber} has been successfully placed.\n\n📋 Items:\n${itemsList}\n\n💰 Total: ₹${totalAmount}\n💳 Payment ID: ${razorpay_payment_id}\n\nWe'll let you know once it's ready! 🍽️`
//             });

//             // Send "Order Ready" WhatsApp after 2 minutes
//             setTimeout(async () => {
//               try {
//                 const readyMessage = await client.messages.create({
//                   from: `whatsapp:${process.env.TWILIO_WHATSAPP_FROM}`,
//                   to: `whatsapp:${phoneNumber}`,
//                   body: `📢 Great news ${user.username || 'Customer'}! Your EduWorld Canteen order #${orderNumber} is now ready for pickup! 🎉\n\n💰 Total: ₹${totalAmount}\n\nPlease collect it from the canteen counter. Enjoy your meal! 🥤🍽️`
//                 });
                
//                 await Order.findOneAndUpdate({ orderNumber }, { status: "ready" });
//               } catch (err) {
//                 // Silent error handling
//               }
//             }, 2 * 60 * 1000); // 2 minutes

//           } catch (whatsappError) {
//             // Silent error handling
//           }
//         }
//       }

//       res.json({ 
//         success: true, 
//         message: "Order placed successfully!",
//         orderNumber,
//         orderId: newOrder._id,
//         paymentId: razorpay_payment_id,
//         order: newOrder
//       });
      
//     } else {
//       res.status(400).json({ 
//         success: false, 
//         message: "Payment verification failed" 
//       });
//     }
//   } catch (error) {
//     res.status(500).json({ 
//       success: false, 
//       message: "Server error during payment verification",
//       error: error.message 
//     });
//   }
// };

// // Legacy placeOrder function
// const placeOrder = async (req, res) => {
//   try {
//     const user = req.user;
    
//     if (user.role !== "student") {
//       return res.status(403).send("Only students can place orders.");
//     }

//     const orderNumber = "EDU" + Math.floor(100000 + Math.random() * 900000);
//     const totalAmount = req.body.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

//     const newOrder = new Order({
//       orderNumber,
//       student: user.id,
//       items: req.body.items,
//       totalAmount,
//       status: "placed"
//     });

//     await newOrder.save();

//     // Send WhatsApp based on user type
//     if (client) {
//       let phoneNumber;
//       let userType;

//       if (!user.password) {
//         // Google Auth user - use hardcoded number
//         phoneNumber = "+918433943227";
//         userType = "Google Auth User";
//       } else if (user.phoneNumber) {
//         // Regular user with phone number
//         phoneNumber = user.phoneNumber.startsWith('+') ? user.phoneNumber : `+91${user.phoneNumber}`;
//         userType = "Regular User";
//       } else {
//         phoneNumber = null;
//       }

//       if (phoneNumber) {
//         try {
//           // Create items list for WhatsApp
//           const itemsList = req.body.items.map(item => 
//             `• ${item.name} x${item.quantity} - ₹${item.price * item.quantity}`
//           ).join('\n');

//           // Send "Order Placed" WhatsApp
//           const placedMessage = await client.messages.create({
//             from: `whatsapp:${process.env.TWILIO_WHATSAPP_FROM}`,
//             to: `whatsapp:${phoneNumber}`,
//             body: `✅ Hi ${user.username || 'Customer'}, your EduWorld Canteen order #${orderNumber} has been successfully placed.\n\n📋 Items:\n${itemsList}\n\n💰 Total: ₹${totalAmount}\n\nWe'll let you know once it's ready! 🍽️`
//           });

//           // Send "Order Ready" WhatsApp after 2 minutes
//           setTimeout(async () => {
//             try {
//               const readyMessage = await client.messages.create({
//                 from: `whatsapp:${process.env.TWILIO_WHATSAPP_FROM}`,
//                 to: `whatsapp:${phoneNumber}`,
//                 body: `📢 Your EduWorld Canteen order #${orderNumber} is now ready! Please collect it from the counter. Enjoy your meal! 🥤`
//               });
              
//               await Order.findOneAndUpdate({ orderNumber }, { status: "ready" });
//             } catch (err) {
//               // Silent error handling
//             }
//           }, 2 * 60 * 1000);

//           res.send(`Order placed and confirmation sent via WhatsApp to ${userType}.`);
//         } catch (whatsappError) {
//           res.send("Order placed successfully (WhatsApp failed).");
//         }
//       } else {
//         res.send("Order placed successfully.");
//       }
//     } else {
//       res.send("Order placed successfully.");
//     }
//   } catch (err) {
//     res.status(500).send("Error placing order.");
//   }
// };

// // Test WhatsApp function
// const testWhatsApp = async (req, res) => {
//   try {
//     if (!client) {
//       return res.json({ 
//         success: false, 
//         error: "Twilio client not initialized" 
//       });
//     }
    
//     // Test message to hardcoded number (Google Auth users)
//     const message1 = await client.messages.create({
//       from: `whatsapp:${process.env.TWILIO_WHATSAPP_FROM}`,
//       to: 'whatsapp:+918433943227',
//       body: '🧪 **TEST MESSAGE**\n\n✅ WhatsApp working for EduWorld Canteen!\n\n📱 Google Auth Users → +918433943227\n📱 Regular Users → Their provided number\n\nTest completed successfully!'
//     });
    
//     res.json({ 
//       success: true, 
//       message: "WhatsApp test sent successfully!",
//       sid: message1.sid,
//       logic: {
//         google_users: "Send to +918433943227",
//         regular_users: "Send to their phone number"
//       }
//     });
//   } catch (error) {
//     res.json({ 
//       success: false, 
//       error: error.message,
//       code: error.code
//     });
//   }
// };

// module.exports = { placeOrder, createRazorpayOrder, verifyRazorpayPayment, testWhatsApp };
const { Order } = require("../Models/OrderModel");
const twilio = require("twilio");
const Razorpay = require("razorpay");
const crypto = require("crypto");

// Initialize Twilio client with debug logging
console.log("🔍 Twilio Init Debug:");
console.log("  SID present?", !!process.env.TWILIO_ACCOUNT_SID);
console.log("  Token present?", !!process.env.TWILIO_AUTH_TOKEN);
console.log("  From number:", process.env.TWILIO_WHATSAPP_FROM);

let client;
try {
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    console.log("✅ Twilio client initialized successfully");
  } else {
    console.error("❌ Missing Twilio credentials in .env");
    client = null;
  }
} catch (error) {
  console.error("❌ Twilio initialization error:", error.message);
  client = null;
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay order
const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    
    const options = {
      amount: amount * 100,
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
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderDetails } = req.body;
    const user = req.user;

    // Create signature for verification
    const sign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (sign === razorpay_signature) {
      // Generate order number
      const orderNumber = "EDU" + Math.floor(100000 + Math.random() * 900000);
      const totalAmount = orderDetails.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

      // Create order in database
      const newOrder = new Order({
        orderNumber,
        student: user.id,
        items: orderDetails.items,
        totalAmount,
        status: "placed",
        paymentDetails: {
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
          payment_method: "Razorpay"
        }
      });

      await newOrder.save();

      // Send WhatsApp based on user type
      if (client) {
        let phoneNumber;
        let userType;

        if (!user.password) {
          // Google Auth user - use hardcoded number
          phoneNumber = "+918433943227";
          userType = "Google Auth User";
        } else if (user.phoneNumber) {
          // Regular user with phone number
          phoneNumber = user.phoneNumber.startsWith('+') ? user.phoneNumber : `+91${user.phoneNumber}`;
          userType = "Regular User";
        } else {
          phoneNumber = null;
        }

        if (phoneNumber) {
          try {
            // Create items list for WhatsApp
            const itemsList = orderDetails.items.map(item => 
              `• ${item.name} x${item.quantity} - ₹${item.price * item.quantity}`
            ).join('\n');

            console.log(`📱 Sending WhatsApp to: ${phoneNumber}`);
            
            // Send "Order Placed" WhatsApp with plain text (not template)
            const placedMessage = await client.messages.create({
              from: `whatsapp:${process.env.TWILIO_WHATSAPP_FROM}`,
              to: `whatsapp:${phoneNumber}`,
              body: `✅ Hi ${user.username || 'Customer'}, your EduWorld Canteen order #${orderNumber} has been successfully placed.\n\n📋 Items:\n${itemsList}\n\n💰 Total: ₹${totalAmount}\n💳 Payment ID: ${razorpay_payment_id}\n\nWe'll let you know once it's ready! 🍽️`
            });

            console.log("✅ WhatsApp message sent. SID:", placedMessage.sid);

            // Send "Order Ready" WhatsApp after 2 minutes
            setTimeout(async () => {
              try {
                console.log(`📱 Sending ready notification to: ${phoneNumber}`);
                
                const readyMessage = await client.messages.create({
                  from: `whatsapp:${process.env.TWILIO_WHATSAPP_FROM}`,
                  to: `whatsapp:${phoneNumber}`,
                  body: `📢 Great news ${user.username || 'Customer'}! Your EduWorld Canteen order #${orderNumber} is now ready for pickup! 🎉\n\n💰 Total: ₹${totalAmount}\n\nPlease collect it from the canteen counter. Enjoy your meal! 🥤🍽️`
                });
                
                console.log("✅ Ready notification sent. SID:", readyMessage.sid);
                await Order.findOneAndUpdate({ orderNumber }, { status: "ready" });
              } catch (readyError) {
                console.error("❌ Ready notification error:", {
                  status: readyError.status,
                  code: readyError.code,
                  message: readyError.message,
                  moreInfo: readyError.moreInfo
                });
              }
            }, 2 * 60 * 1000); // 2 minutes

          } catch (whatsappError) {
            console.error("❌ WhatsApp send error:", {
              status: whatsappError.status,
              code: whatsappError.code,
              message: whatsappError.message,
              moreInfo: whatsappError.moreInfo
            });
          }
        }
      }

      res.json({ 
        success: true, 
        message: "Order placed successfully!",
        orderNumber,
        orderId: newOrder._id,
        paymentId: razorpay_payment_id,
        order: newOrder
      });
      
    } else {
      res.status(400).json({ 
        success: false, 
        message: "Payment verification failed" 
      });
    }
  } catch (error) {
    console.error("❌ Payment verification error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error during payment verification",
      error: error.message 
    });
  }
};

// Legacy placeOrder function
const placeOrder = async (req, res) => {
  try {
    const user = req.user;
    
    if (user.role !== "student") {
      return res.status(403).send("Only students can place orders.");
    }

    const orderNumber = "EDU" + Math.floor(100000 + Math.random() * 900000);
    const totalAmount = req.body.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const newOrder = new Order({
      orderNumber,
      student: user.id,
      items: req.body.items,
      totalAmount,
      status: "placed"
    });

    await newOrder.save();

    // Send WhatsApp based on user type
    if (client) {
      let phoneNumber;
      let userType;

      if (!user.password) {
        // Google Auth user - use hardcoded number
        phoneNumber = "+918433943227";
        userType = "Google Auth User";
      } else if (user.phoneNumber) {
        // Regular user with phone number
        phoneNumber = user.phoneNumber.startsWith('+') ? user.phoneNumber : `+91${user.phoneNumber}`;
        userType = "Regular User";
      } else {
        phoneNumber = null;
      }

      if (phoneNumber) {
        try {
          // Create items list for WhatsApp
          const itemsList = req.body.items.map(item => 
            `• ${item.name} x${item.quantity} - ₹${item.price * item.quantity}`
          ).join('\n');

          console.log(`📱 Sending WhatsApp to: ${phoneNumber}`);

          // Send "Order Placed" WhatsApp
          const placedMessage = await client.messages.create({
            from: `whatsapp:${process.env.TWILIO_WHATSAPP_FROM}`,
            to: `whatsapp:${phoneNumber}`,
            body: `✅ Hi ${user.username || 'Customer'}, your EduWorld Canteen order #${orderNumber} has been successfully placed.\n\n📋 Items:\n${itemsList}\n\n💰 Total: ₹${totalAmount}\n\nWe'll let you know once it's ready! 🍽️`
          });

          console.log("✅ WhatsApp message sent. SID:", placedMessage.sid);

          // Send "Order Ready" WhatsApp after 2 minutes
          setTimeout(async () => {
            try {
              console.log(`📱 Sending ready notification to: ${phoneNumber}`);
              
              const readyMessage = await client.messages.create({
                from: `whatsapp:${process.env.TWILIO_WHATSAPP_FROM}`,
                to: `whatsapp:${phoneNumber}`,
                body: `📢 Your EduWorld Canteen order #${orderNumber} is now ready! Please collect it from the counter. Enjoy your meal! 🥤🍽️`
              });
              
              console.log("✅ Ready notification sent. SID:", readyMessage.sid);
              await Order.findOneAndUpdate({ orderNumber }, { status: "ready" });
            } catch (readyError) {
              console.error("❌ Ready notification error:", {
                status: readyError.status,
                code: readyError.code,
                message: readyError.message
              });
            }
          }, 2 * 60 * 1000);

          res.send(`Order placed and confirmation sent via WhatsApp to ${userType}.`);
        } catch (whatsappError) {
          console.error("❌ WhatsApp error:", {
            status: whatsappError.status,
            code: whatsappError.code,
            message: whatsappError.message,
            moreInfo: whatsappError.moreInfo
          });
          res.send("Order placed successfully (WhatsApp failed).");
        }
      } else {
        res.send("Order placed successfully.");
      }
    } else {
      res.send("Order placed successfully.");
    }
  } catch (err) {
    console.error("❌ Place order error:", err);
    res.status(500).send("Error placing order.");
  }
};

// Test WhatsApp function
const testWhatsApp = async (req, res) => {
  try {
    console.log("🧪 Testing Twilio WhatsApp...");
    
    if (!client) {
      console.error("❌ Twilio client not initialized");
      return res.json({ 
        success: false, 
        error: "Twilio client not initialized",
        debug: {
          SID: !!process.env.TWILIO_ACCOUNT_SID,
          Token: !!process.env.TWILIO_AUTH_TOKEN,
          From: process.env.TWILIO_WHATSAPP_FROM
        }
      });
    }
    
    console.log(`📱 Sending test message from: ${process.env.TWILIO_WHATSAPP_FROM}`);
    
    // Test message to hardcoded number (Google Auth users)
    const message1 = await client.messages.create({
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_FROM}`,
      to: 'whatsapp:+918433943227',
      body: '🧪 **TEST MESSAGE**\n\n✅ WhatsApp working for EduWorld Canteen!\n\n📱 Google Auth Users → +918433943227\n📱 Regular Users → Their provided number\n\nTest completed successfully!'
    });
    
    console.log("✅ Test message sent. SID:", message1.sid);
    
    res.json({ 
      success: true, 
      message: "WhatsApp test sent successfully!",
      sid: message1.sid,
      logic: {
        google_users: "Send to +918433943227",
        regular_users: "Send to their phone number"
      }
    });
  } catch (error) {
    console.error("❌ WhatsApp test error:", {
      status: error.status,
      code: error.code,
      message: error.message,
      moreInfo: error.moreInfo
    });
    
    res.json({ 
      success: false, 
      error: error.message,
      code: error.code,
      status: error.status,
      moreInfo: error.moreInfo
    });
  }
};

module.exports = { placeOrder, createRazorpayOrder, verifyRazorpayPayment, testWhatsApp };