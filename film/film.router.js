const { Router } = require("express");
const Film = require("../models/film.model");
const Director = require("../models/director.model");
const { isValidObjectId } = require("mongoose");
const filmSchema = require("../validations/film.schema");
const allowToCreateTheFilmOnlyIfDirectorIdIsThere = require("../middlewares/allow-to-create-the-film-only-if-director-id-is-there");

const filmsRouter = Router();

filmsRouter.get("/", async (req, res) => {

    const genre = req.query.genre;
    const year = req.query.year;

    const filter = {};

    if (genre) {
        filter.genre = genre.toLowerCase();
    }

    if (year) {
        const yearNumber = parseInt(year);

        if (isNaN(yearNumber)) {
            return res.status(400).json({ message: "Year must be a number" });
        }

        filter.year = yearNumber;
    }

    const films = await Film.find(filter).populate("director", "name age");
    res.status(200).json(films);
});

filmsRouter.post("/", allowToCreateTheFilmOnlyIfDirectorIdIsThere ,async (req, res) => {
    const directorId = req.headers['director-id'];
    
    if (!directorId) {
        return res.status(400).json({ message: "Director ID is required" });
    }

    if (!isValidObjectId(directorId)) {
        return res.status(400).json({ message: "Invalid director ID" });
    }

    const director = await Director.findById(directorId);
    if (!director) {
        return res.status(404).json({ message: "Director not found" });
    }

    const { error, value } = filmSchema.validate(req.body || {}); 
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    const { title, content, genre, year } = value;

    const newFilm = await Film.create({ title, content, genre, year, director: directorId });
    await Director.findByIdAndUpdate(directorId, { $push: { films: newFilm._id } });    
    res.status(201).json({ message: "Created successfully", data: newFilm });
});

filmsRouter.delete('/:id', async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
        return res.status(400).json({ message: "Invalid film ID" });
    }

    const film = await Film.findById(id);
    if (!film) {
        return res.status(404).json({ message: "Film not found" });
    }

    if(film.director.toString() !== req.directorId) {
        return res.status(403).json({ message: "You are not allowed to delete this film" });
    }

    if (film.director) {
        await Director.findByIdAndUpdate(
            film.director,
            { $pull: { films: film._id } }
        );
    }

    await Film.findByIdAndDelete(id);
    res.status(200).json({ message: "Deleted successfully" });
});

filmsRouter.put("/:id", async (req, res) => {
    const { id } = req.params;
    
    if (!isValidObjectId(id)) {
        return res.status(400).json({ message: "Invalid film ID" });
    }

    const film = await Film.findById(id);
    if(film.director.toString() !== req.directorId) {
        return res.status(403).json({ message: "You are not allowed to edit this film" });
    }

    const { title, content, director, genre, year } = req.body;
    if (!title && !content && !director && !genre && !year) {
        return res.status(400).json({ message: "At least one field is required to update" });
    }

    const updatedFilm = await Film.findByIdAndUpdate(id, { title, content }, { new: true });
    if (!updatedFilm) {
        return res.status(404).json({ message: "Film not found" });
    }

    res.status(200).json({ message: "Updated successfully", data: updatedFilm });
})

filmsRouter.post("/:id/reactions", async (req, res) => {
    const { id } = req.params;
    const { reaction } = req.body;
    const validReactions = ["like", "dislike"];
    if (!validReactions.includes(reaction)) {
        return res.status(400).json({ message: "Invalid reaction type" });
    }

    if (!isValidObjectId(id)) {
        return res.status(400).json({ message: "Invalid film ID" });
    }

    const film = await Film.findById(id);
    if (!film) {
        return res.status(404).json({ message: "Film not found" });
    }
    
    const alreadyLikedIndex = film.reactions.likes.findIndex(like => like.toString() === req.directorId);
    const alreadyDislikedIndex = film.reactions.dislikes.findIndex(dislike => dislike.toString() === req.directorId);


    if(reaction === "like") {
        if (alreadyLikedIndex !== -1) {
            film.reactions.likes.splice(alreadyLikedIndex, 1);
        } else {
            film.reactions.likes.push(req.directorId);
        }
    }

    if(reaction === "dislike") {
        if (alreadyDislikedIndex !== -1) {
            film.reactions.dislikes.splice(alreadyDislikedIndex, 1);
        } else {
            film.reactions.dislikes.push(req.directorId);
        }
    }

    if(alreadyLikedIndex !== -1 && reaction === "dislike") {
        film.reactions.likes.splice(alreadyLikedIndex, 1);
    }

    if(alreadyDislikedIndex !== -1 && reaction === "like") {
        film.reactions.dislikes.splice(alreadyDislikedIndex, 1);
    }

    await film.save();
    res.status(200).json({ message: "Reaction updated successfully", data: film });
})

filmsRouter.get("/:id", async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
        return res.status(400).json({ message: "Invalid film ID" });
    }

    const film = await Film.findById(id).populate("director", "name age");
    if (!film) {
        return res.status(404).json({ message: "Film not found" });
    }

    res.status(200).json(film);
})

module.exports = filmsRouter;