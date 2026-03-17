const Task = require("../model/task.model");
module.exports = class TaskService {
    async addTask(body) {
        try {
            return await Task.create(body);
        } catch (err) {
            console.error("Register Error:", err);
        }
    }

    async fetchSingleTask(body) {
        try {
            return await Task.findOne(body);
        } catch (err) {
            console.error("Fetch Task Error:", err);
        }
    }
    async fetchAllTasks(query) {
        try {
            return await Task.find();
        } catch (err) {
            console.error("Fetch All Tasks Error:", err);
        }
    }

    async updateTask(id, body) {
        try {
            return await Task.findByIdAndUpdate(id, body, { new: true });
        } catch (err) {
            console.error("Update Task Error:", err);
        }
    }

    async deleteTask(id) {
        try {
            return await Task.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
        } catch (err) {
            console.error("Delete Task Error:", err);
        }
    }
};