const e = require("express");
const { default: mongoose } = require("mongoose");

const directorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: false,
    },
    email: {
        type: String,
        required: true,

    },
    password: {
        type: String,
        required: true,
    },
    films: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "film",
    }],
});

module.exports = mongoose.model("director", directorSchema);