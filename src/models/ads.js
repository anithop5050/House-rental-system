const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
        default: 'A good house'
    },
    squareFeet: {
        type: Number,
        required: true
    },
    floors: {
        type: Number,
        required: true,
    },
    bedrooms: {
        type: Number,
        required: true
    },
    bathrooms: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false,
        default: null
    },
    price: {
        type: Number,
        required: false,
        default: 1000
    },
    user: {
        type: String,
        required: true,
        default: null
    },
    status: {
        type: Number,
        required: false,
        default: 1
    },
    tenant: {
        type: String,
        required: false,
        default: null
    }
});

const Register = mongoose.model("ads", employeeSchema);

module.exports = Register;
