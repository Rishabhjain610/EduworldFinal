const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 8080;
const cors = require('cors');
const cloudinary = require('cloudinary').v2;
const { Pdf } = require("./Models/pdfModel");
const { Order } = require('./Models/OrderModel');
const authRoute = require("./Routes/AuthRoute");
const aiRoutes = require("./Routes/CodeEditorRoute");
const cookieParser = require("cookie-parser");
const { Event } = require("./Models/calendarModel");
const verifyUser = require("./Middlewares/verifyUserMiddleware");
const twilio = require("twilio");
const dotenv = require('dotenv');

const multer = require('multer');
const { userVerification } = require('./Middlewares/AuthMiddleware');
const upload = multer({
    storage: multer.memoryStorage(),
});

dotenv.config();

//rishabh's code
// const twilio = require('twilio');




const app = express();
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

mongoose.connect(process.env.ATLASDB_URL)
    .then(() => console.log('DB Connected!'));


const corsOptions = {
    origin: ['http://localhost:5173'], // Frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
};

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

app.use(cors(corsOptions));
app.use(bodyParser.json()); //The json() method specifically parses incoming requests where the Content-Type is application/json. It converts the raw JSON data from the request body into a JavaScript object.
app.use(cookieParser());
app.use(express.json());

app.use("/auth", authRoute);
app.use("/ai", aiRoutes);

app.post("/upload-files", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).send("No file uploaded.");
    }

    const originalName = req.body.fileName || req.file.originalname;
    const baseName = originalName.replace(/\.[^/.]+$/, ""); // removes .pdf or any extension


    const uploadStream = cloudinary.uploader.upload_stream(
        {
            resource_type: "raw",
            folder: "MPRpdfs",
            public_id: baseName,
            format: "pdf",
            use_filename: true,
            unique_filename: false,
            overwrite: true
        },
        (error, result) => {
            if (error) {
                console.error("Cloudinary upload error:", error);
                return res.status(500).send("Error uploading file.");
            }


            const newPdf = new Pdf({
                pdf: result.secure_url, // Cloudinary URL
                fileName: req.body.fileName || req.file.originalname,
                subject: req.body.subject,
                year: req.body.year,
                branch: req.body.branch,
                uploadedBy: req.body.uploadedBy
            });

            newPdf.save()
                .then(() => {
                    res.send({
                        url: result.secure_url,
                        message: "File uploaded and saved successfully"
                    });
                })
                .catch((saveError) => {
                    console.error("Error saving PDF document:", saveError);
                    res.status(500).send("File uploaded but saving failed");
                });
        }
    );

    // Write the file buffer to the upload stream.
    uploadStream.end(req.file.buffer);
});


app.get("/show-pdfs", verifyUser, async (req, res) => {
    const { year, branch, subject } = req.query;
    const filter = {};
    if (year) filter.year = year;
    if (branch) filter.branch = branch;
    if (subject) filter.subject = subject

    try {
        const allPdfs = await Pdf.find(filter);
        res.json(allPdfs);
    } catch (error) {
        console.error("Error fetching PDFs: ", error);
        res.status(500).send("Error retrieving PDFs");
    }
});

app.post("/events", verifyUser, async (req, res) => {
    try {
        const { title, description, startDate, endDate, classInfo } = req.body;
        console.log("User", req.user);
        // Use req.user from teacherAuth middleware to get createdBy
        const newEvent = new Event({
            title,
            description,
            startDate,
            endDate,
            classInfo,
            createdBy: req.user.id,
        });
        await newEvent.save();

        res.status(201).json({ success: true, event: newEvent });
    } catch (error) {
        console.error("Error creating event:", error);
        res.status(500).json({ success: false, message: "Error creating event" });
    }
});

app.get("/events", verifyUser, async (req, res) => {
    try {
        const { classInfo, startDate, endDate } = req.query;
        let filter = {};

        if (classInfo) {
            filter.classInfo = classInfo;
        }

        // If date filtering is needed, include it in the filter.
        // if (startDate || endDate) {
        //     filter.startDate = {};
        //     if (startDate) filter.startDate.$gte = new Date(startDate);
        //     if (endDate) filter.startDate.$lte = new Date(endDate);
        // }

        const events = await Event.find(filter).populate("createdBy", "username");
        res.status(200).json({ success: true, events });
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({ success: false, message: "Error fetching events" });
    }
});


app.post("/place-order", verifyUser, async (req, res) => {
    console.log("order recieved");
    console.log("User", req.user);
    try {
        const user = req.user;
        // Only allow students with phone numbers
        if (user.role !== "student" || !user.phoneNumber) {
            return res.status(403).send("Only students with phone numbers can place orders.");
        }

        // Generate unique random order number (e.g., 6-digit)
        const orderNumber = "ORD" + Math.floor(100000 + Math.random() * 900000);

        const totalAmount = req.body.items.reduce((sum, item) => {
            return sum + item.price * item.quantity;
        }, 0);

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
                // Optional: Update order status in DB
                await Order.findOneAndUpdate({ orderNumber }, { status: "ready" });

            } catch (err) {
                console.error("Failed to send ready message:", err.message);
            }
        }, 2 * 60 * 1000); // 2 minutes

        res.send("Order placed and confirmation sent via WhatsApp.");

    } catch (err) {
        console.error(err);
        res.status(500).send("Error placing order.");
    }
});


app.get("/", (req, res) => {
    res.send("hello");
})

app.listen(PORT, () => {
    console.log(`listening at port ${PORT}`);
});