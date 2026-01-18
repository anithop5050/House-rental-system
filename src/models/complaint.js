const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    complaint: {
        type: String,
        required: true
    },
    response: {
        type: String,
        required: false,
        default: null
    },
    subject: {
        type: String,
        required: true,
        default: 'None'
    },
    user: {
        type: String,
        required: true,
        default: null
    }
});

const Register = mongoose.model("complaint", employeeSchema);

module.exports = Register;
