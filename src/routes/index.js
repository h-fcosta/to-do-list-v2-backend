import express from "express";
import auth from "./authRoutes.js";
import tasks from "./taskRoutes.js";

const routes = (app) => {
  app.route("/").get((req, res) => {
    res.status(200).json({ message: "To-do List v2 by Henrique Costa" });
  });
  app.use(express.json(), auth, tasks);
};

export default routes;
