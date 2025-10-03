const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv").config();
const PORT = process.env.PORT||8080;
const cors = require("cors");
const cloudinary = require("cloudinary").v2;

const authRoute = require("./Routes/AuthRoute");
const aiRoutes = require("./Routes/CodeEditorRoute");
const cookieParser = require("cookie-parser");
const { Event } = require("./Models/calendarModel");


const pdfRouter = require("./Routes/pdfRoutes");
const eventRouter = require("./Routes/eventsRoute");
const orderRouter = require("./Routes/orderRoutes");
const multer = require("multer");

const ConnectDB = require("./DB/Db");


const app = express();

ConnectDB();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

app.use(
  cors({
    origin: ["*","http://localhost:5173","http://localhost:5174"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);
app.use(bodyParser.json()); //The json() method specifically parses incoming requests where the Content-Type is application/json. It converts the raw JSON data from the request body into a JavaScript object.
app.use(cookieParser());
app.use(express.json());

app.use("/auth", authRoute);
app.use("/ai", aiRoutes);
app.use("/api/pdf", pdfRouter); // Handles /upload-files and /show-pdfs
app.use("/api/event", eventRouter); // Handles /events
app.use("/api/order", orderRouter);



app.listen(PORT, () => {
  console.log(`listening at port ${PORT}`);
});
