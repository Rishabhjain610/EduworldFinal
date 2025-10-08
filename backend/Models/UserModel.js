const mongoose = require("mongoose");
const {Schema, model} = mongoose;
const userSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Optional for Firebase users
  role: { type: String, enum: ["student", "teacher"], default: "student" },
  phoneNumber: { type: String }
   // Optional for Firebase users
});

const User = model("User", userSchema);

module.exports = { User };