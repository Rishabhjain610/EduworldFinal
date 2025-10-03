require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports.createSecretToken = (id) => {
    
    try {
        return jwt.sign({ id }, process.env.JWT_TOKEN_KEY, {
            expiresIn: 3 * 24 * 60 * 60,
        });
    } catch (err) {
        console.log("Error generating token:", err); return undefined;
    }
};