const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
    HouseId: {
        type: String,
        required: true
    },
    HouseOwner: {
        type: String,
        required: true
    },
    JobStatus: {
        type: String,
        required: true
    },
    LifeStatus: {
        type: String,
        required: true
    },
    Members: {
        type: Number,
        required: true
    },
    CarParking: {
        type: Boolean,
        required: true
    },
    Requester: {
        type: String,
        required: true
    },
    Status: {
        type: String,
        required: true,
        default: "Pending"
    }
});

const Register = mongoose.model("request", employeeSchema);

module.exports = Register;
