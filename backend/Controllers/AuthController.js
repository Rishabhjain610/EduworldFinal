
const { User } = require("../Models/UserModel");
const { createSecretToken } = require("../Util/SecretToken");
const bcrypt = require("bcryptjs");

const Signup = async (req, res) => {
  try {
    const { email, password, username, phoneNumber } = req.body;
    const role = "student";

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    let hashedPassword = "";
    if (password) {
      hashedPassword = await bcrypt.hash(password, 12);
    }

    const user = await User.create({
      email,
      password: hashedPassword,
      username,
      role,
      phoneNumber,
    });

    const token = createSecretToken(user._id);
    res.cookie("token", token, {
      sameSite: "None",
      httpOnly: true,
      secure: true,
    });

    return res.status(201).json({
      message: "User signed up successfully",
      success: true,
      user,
      role: user.role,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error signing up" });
  }
};

const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (!user.password) {
      return res.status(400).json({ message: "This account uses Google login only." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = createSecretToken(user._id);
    res.cookie("token", token, {
      sameSite: "None",
      httpOnly: true,
      secure: true,
    });

    return res.status(200).json({
      message: "Login successful",
      success: true,
      user,
      role: user.role,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error logging in" });
  }
};

const firebaseLogin = async (req, res) => {
  try {
    const { name, email } = req.body; // Changed from username to name
    let user = await User.findOne({ email });
    
    if (!user) {
      user = await User.create({
        email,
        username: name, // Use name as username
        role: "student",
        password: "", // No password for Firebase users
      });
    }
    
    const token = createSecretToken(user._id);
    res.cookie("token", token, {
      sameSite: "None",
      httpOnly: true,
      secure: true,
    });
    
    return res.status(200).json({
      message: "Google login successful",
      success: true,
      role: user.role,
      username: user.username,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error with Google login" });
  }
};

module.exports = { Signup, Login, firebaseLogin };