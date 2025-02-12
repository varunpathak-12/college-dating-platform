const jwt = require("jsonwebtoken");
const User = require("../models/User");
const dotenv = require("dotenv");

dotenv.config(); // ✅ Ensure environment variables are loaded

const authMiddleware = async (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1]; // Extract Bearer token

    if (!token) {
        return res.status(401).json({ msg: "No token, authorization denied" });
    }

    try {
        console.log("🔍 Decoding Token:", token); // ✅ Debugging Line

        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Check if JWT_SECRET is correct
        console.log("✅ Token Decoded Successfully:", decoded);

        req.user = await User.findById(decoded.user.id).select("-password");
        if (!req.user) {
            return res.status(401).json({ msg: "User not found" });
        }

        next();
    } catch (error) {
        console.error("❌ JWT Verification Failed:", error.message);
        return res.status(401).json({ msg: "Token is not valid" });
    }
};

module.exports = authMiddleware;
