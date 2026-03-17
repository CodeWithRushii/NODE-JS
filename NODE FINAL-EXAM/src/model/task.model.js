const mongoose = require("mongoose")

const taskSchema = mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    description : {
        type : String
    },
    status : {
        type : String,
    },
    priority : {
        type : String,
    },
    dueDate : {
        type : String,
    },
    userId : {
        type : String,
        require : true
    },
    isDeleted : {
        type : Boolean,
        default : false
    },
    createAt : {
        type : String,
    },
    updateAt : {
        type : String,
    }
});

module.exports = mongoose.model("Task", taskSchema, "Task")
