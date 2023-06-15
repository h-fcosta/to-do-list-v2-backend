import redisClient from "../config/redis.js";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function authenticateUser(req, res, next) {
  try {
    const accessToken = req.headers.authorization?.split(" ")[1];
    const verifyToken = await redisClient.get(`blacklist: ${accessToken}`);

    const userId = jwt.verify(accessToken, process.env.SECRET_JWT);
    const userVerified = await User.findByPk(userId.sub);

    if (verifyToken) {
      return res.status(403).json({ message: "Access token invalid" });
    }

    if (userVerified.isVerified === false) {
      return res.status(403).json({ message: "User not verified" });
    }

    next();
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}
