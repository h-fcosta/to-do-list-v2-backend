import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import redisClient from "../config/redis.js";

export default class AuthController {
  static async registerUser(req, res) {
    const { name, email, password, confirmPassword } = req.body;

    if (confirmPassword !== password) {
      return res.status(401).json({ message: "Passwords are different" });
    }

    const userExists = await User.findOne({ where: { email: email } });

    if (userExists) {
      return res.status(401).json({ message: "E-mail already in use" });
    }

    try {
      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(password, salt);

      await User.create({ name, email, password: passwordHash });

      return res.status(201).json({ message: "User created" });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "An error ocurred while registering user." });
    }
  }

  static async loginUser(req, res) {
    const { email, password } = req.body;

    const findUser = await User.findOne({ where: { email: email } });

    if (!findUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const checkPassword = await bcrypt.compare(password, findUser.password);

    if (!checkPassword) {
      res.status(401).json({ message: "E-mail or password incorrect." });
    }

    try {
      const accessToken = jwt.sign(
        { sub: findUser.id },
        process.env.SECRET_JWT,
        { expiresIn: "15m" }
      );

      const refreshToken = crypto.randomBytes(64).toString("hex");

      await redisClient.set(refreshToken, findUser.id.toString(), "EX", 604800);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 604800000
      });

      return res
        .status(201)
        .set("Authorization", accessToken)
        .json({ accessToken, refreshToken });
    } catch (error) {
      return res.status(401).json({ message: "Login failed" });
    }
  }

  static async logoutUser(req, res) {
    try {
      const refreshToken = req.cookies.refreshToken;
      const accessToken = req.headers.authorization.split(" ")[1];

      await redisClient.set(`blacklist: ${accessToken}`, "revoked");
      await redisClient.del(refreshToken);

      return res.status(200).json({ message: "User logged out." });
    } catch (error) {
      return res.status(400).json({ message: "Unable to logout user." });
    }
  }

  static async renewRefreshToken(req, res) {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        return res.status(403).json({ message: "Refresh Token not found" });
      }

      const userId = await redisClient.get(refreshToken);

      if (!userId) {
        return res
          .status(401)
          .json({ message: "Refresh Token expired or invalid" });
      }

      const accessToken = jwt.sign({ sub: userId }, process.env.SECRET_JWT, {
        expiresIn: "15m"
      });

      const newRefreshToken = crypto.randomBytes(64).toString("hex");

      await redisClient.set(newRefreshToken, userId, "EX", 604800);
      await redisClient.del(refreshToken);

      return res
        .status(201)
        .set("Authorization", accessToken)
        .cookie("refreshToken", newRefreshToken, {
          httpOnly: true,
          sameSite: "strict",
          maxAge: 604800000
        })
        .json({ accessToken, newRefreshToken });
    } catch {
      return res.status(401).json({ message: "Unable to refresh tokens." });
    }
  }
}
