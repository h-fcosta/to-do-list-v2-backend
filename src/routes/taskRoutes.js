import express from "express";
import TaskController from "../controllers/taskController.js";
import { authenticateToken } from "../controllers/middleware.js";

const router = express.Router();

router
  .get("/tasks", authenticateToken, TaskController.getTasks)
  .post("/tasks", authenticateToken, TaskController.newTask)
  .put("/tasks/:idTask", authenticateToken, TaskController.editTask)
  .delete("/tasks/:idTask", authenticateToken, TaskController.deleteTask);

export default router;
