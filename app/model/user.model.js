const mongoose = require('mongoose');

const user = mongoose.Schema({
    name: {
        type: String,
        required: [true, "name require"]
    },
    email: {
        type: String,
        required: [true, "email require"]
    },
    password: {
        type: String,
        required: [true, "password require"]
    },
    isAdmin: {
        type:String,
        default: 'USER'
    }

});

module.exports = mongoose.model("user", user);