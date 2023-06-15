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

export function validateRegisterInput(name, email, password, confirmPassword) {
  const errors = {};

  //Checks if name field is empty
  if (!name || name.trim() === "") {
    errors.name = "Name required";
  }

  //Checks if email is valid
  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/;

    return emailRegex.test(email);
  };

  //Checks if email field is empty
  if ((email && !isValidEmail) || email.trim() === "") {
    errors.email = "E-mail address is invalid";
  }

  //Checks if password field is empty
  if (!password || password.trim() === "" || password.length < 5) {
    errors.password = "Password must have at least 5 characters";
  }

  //Checks if passwords are the same
  if (
    !confirmPassword ||
    confirmPassword.trim() === "" ||
    password !== confirmPassword
  ) {
    errors.password = "Passwords don't match";
  }

  return errors;
}

export function validateLoginInput(email, password) {
  const errors = {};

  //Checks if email field is empty
  if (email || email.trim() === "") {
    errors.email = "E-mail address is invalid";
  }

  //Checks if password field is empty
  if (!password || password.trim() === "" || password.length < 5) {
    errors.password = "Password must have at least 5 characters";
  }

  return errors;
}

export function validateTaskInput(title) {
  const errors = {};

  console.log(Object.keys(title));

  if (!title || title.trim() === "") {
    errors.title = "Field required";
  }

  return errors;
}
