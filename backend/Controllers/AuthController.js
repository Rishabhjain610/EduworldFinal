const { User } = require("../Models/UserModel");
const { createSecretToken } = require("../Util/SecretToken");
const bcrypt = require("bcryptjs");

module.exports.Signup = async (req, res) => {
  try {
    const { email, password, username, phoneNumber } = req.body;
    // Force role to 'student' regardless of any input
    const role = "student";

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create user with role forced as 'student'
    const user = await User.create({
      email,
      password,
      username,
      role,
      phoneNumber,
    });

    // Create token with payload that includes user id and role
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

module.exports.Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Incorrect email or password" });
    }
    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return res.status(401).json({ message: "Incorrect email or password" });
    }

    // Create token with user id and role
    const token = createSecretToken(user._id);
    res.cookie("token", token, {
      sameSite: "None",
      httpOnly: true,
      secure: true,
    });

    return res.status(200).json({
      message: "User logged in successfully",
      success: true,
      role: user.role,
      username: user.username,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error logging in" });
  }
};
