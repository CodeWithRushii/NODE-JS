const express = require("express")
const { authMiddleware } = require('../../middleware/auth.middleware');
const { addTask, getAllTasks, getSingleTask, updateTask, deleteTask } = require("../../controller/task/task.controller")

const taskRoute = express.Router()

taskRoute.use(authMiddleware);
taskRoute.post("/", addTask)
taskRoute.get("/", getAllTasks)
taskRoute.get("/:id", getSingleTask)
taskRoute.put("/:id", updateTask)
taskRoute.delete("/:id", deleteTask)

module.exports = taskRoute
