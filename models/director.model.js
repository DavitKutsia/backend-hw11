const { default: mongoose } = require("mongoose");

const directorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    films: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "film",
    }],
});

module.exports = mongoose.model("director", directorSchema);