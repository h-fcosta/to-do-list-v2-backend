import Task from "../models/Task.js";
import jwt from "jsonwebtoken";

export default class TaskController {
  static async newTask(req, res) {
    const { title, description } = req.body;

    const validationErrors = validateTaskInput(title);

    if (Object.keys(validationErrors).length > 0) {
      return res.status(400).json({ errors: validationErrors });
    }

    const userId = jwt.verify(
      req.headers.authorization.split(" ")[1],
      process.env.SECRET_JWT
    );

    try {
      const task = await Task.create({
        title,
        description,
        UserId: userId.sub
      });

      return res.status(201).json({ message: "Task created", task });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "An error ocurred while inserting task" });
    }
  }

  static async getTasks(req, res) {
    try {
      const userId = jwt.verify(
        req.headers.authorization.split(" ")[1],
        process.env.SECRET_JWT
      );

      const listTasks = await Task.findAll({ where: { UserId: userId.sub } });

      return res.status(200).json(listTasks);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: "An error ocurred while listing all the user tasks."
      });
    }
  }

  static async editTask(req, res) {
    try {
      const taskId = req.params.idTask;

      const { title, description } = req.body;

      const validationErrors = validateTaskInput(title);

      if (Object.keys(validationErrors).length > 0) {
        return res.status(400).json({ errors: validationErrors });
      }

      const task = await Task.findByPk(taskId);

      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      if (title) {
        task.title = title;
      }

      if (description) {
        task.description = description;
      }

      await task.save();

      return res.status(200).json(task);
    } catch (error) {
      console.error(error);

      return res
        .status(500)
        .json({ message: "An error ocurred while updating the task" });
    }
  }

  static async deleteTask(req, res) {
    try {
      const taskId = req.params.idTask;

      const task = await Task.findByPk(taskId);

      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      await Task.destroy({ where: { id: taskId } });

      return res.status(200).json({ message: "Task deleted" });
    } catch (error) {
      console.error(error);

      res
        .status(500)
        .json({ message: "An error ocurred while updating the task" });
    }
  }
}
