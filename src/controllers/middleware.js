import redisClient from "../config/redis.js";

export async function authenticateToken(req, res, next) {
  const accessToken = req.headers.authorization?.split(" ")[1];
  const verifyToken = await redisClient.get(`blacklist: ${accessToken}`);

  if (verifyToken) {
    return res.status(401).json({ message: "Access token invalid" });
  }

  next();
}
