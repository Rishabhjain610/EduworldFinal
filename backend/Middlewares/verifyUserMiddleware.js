const { User } = require("../Models/UserModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyUser = async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res
      .status(401)
      .json({ status: false, message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_TOKEN_KEY); // decoded.id matlab the logged in user ka user._id hoga, hum token mai encode kia hua id vapas decode karke uss id ke madath se user find karenge
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("JWT error:", err);
    return res.status(401).json({ status: false, message: "Invalid token" });
  }
};

module.exports = { verifyUser };
