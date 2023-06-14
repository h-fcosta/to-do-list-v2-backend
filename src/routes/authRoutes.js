import express from "express";
import AuthController from "../controllers/authController.js";
import { authenticateToken } from "../controllers/middleware.js";

const router = express.Router();

router
  .post("/auth/register", AuthController.registerUser)
  .post("/auth/login", AuthController.loginUser)
  .post("/auth/logout", authenticateToken, AuthController.logoutUser)
  .post("/auth/renew", authenticateToken, AuthController.renewRefreshToken);

export default router;
