const { default: mongoose } = require("mongoose")

const filmSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    genre: {
        type: String,
        enum: ["action", "comedy", "drama", "horror", "romance", "sci-fi"],
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    director: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "director",
    },
});

module.exports = mongoose.model("film", filmSchema);