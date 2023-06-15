import express from "express";
import AuthController from "../controllers/authController.js";
import { authenticateUser } from "../controllers/middleware.js";

const router = express.Router();

router
  .post("/auth/register", AuthController.registerUser)
  .post("/auth/login", AuthController.loginUser)
  .post("/auth/logout", authenticateUser, AuthController.logoutUser)
  .post("/auth/renew", authenticateUser, AuthController.renewRefreshToken)
  .get("/verify/:token", AuthController.verifyEmail);

export default router;
