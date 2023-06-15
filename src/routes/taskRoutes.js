import express from "express";
import TaskController from "../controllers/taskController.js";
import { authenticateUser } from "../controllers/middleware.js";

const router = express.Router();

router
  .get("/tasks", authenticateUser, TaskController.getTasks)
  .post("/tasks", authenticateUser, TaskController.newTask)
  .put("/tasks/:idTask", authenticateUser, TaskController.editTask)
  .delete("/tasks/:idTask", authenticateUser, TaskController.deleteTask);

export default router;
