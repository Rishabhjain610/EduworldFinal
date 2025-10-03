const mongoose = require("mongoose");
const ConnectDB=async(req ,res)=>{
  try {
    await mongoose.connect(process.env.ATLASDB_URL);
    console.log("MongoDB connected Rishabh's DB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}
module.exports=ConnectDB;