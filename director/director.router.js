const { Router } = require("express");
const Director = require("../models/director.model");
const { isValidObjectId } = require("mongoose");
const Film = require("../models/film.model");
const directorSchema = require("../validations/director.schema");
const upload = require("../config/cloudinary.config");

const directorsRouter = Router();

directorsRouter.get("/", async (req, res) => {
    const directors = await Director.find().populate("films", "title content genre year");
    res.status(200).json(directors);
});

directorsRouter.post("/", async (req, res) => {
        
    const { error, value } = directorSchema.validate(req.body || {});
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    const { name, age, email, password, role } = value;


    const newDirector = await Director.create({ name, age, email, password, role });
    res.status(201).json({ message: "Created successfully", data: newDirector });
});

// დირექტორის წაშლისას იშლება ამ დირექტორის ყველა ფილმებიც
directorsRouter.delete('/:id', async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
        return res.status(400).json({ error: "Invalid director ID" });
    }

    await Film.deleteMany({ director: id });

    const deletedDirector = await Director.findByIdAndDelete(id);
    if (!deletedDirector) {
        return res.status(404).json({ error: "Director not found" });
    }

    res.json({ 
        message: "Director and all their films deleted successfully",
        deletedDirector
    });
});

directorsRouter.put("/", async (req, res) => {
    const { id } = req.userId;

    if (!isValidObjectId(id)) {
        return res.status(400).json({ message: "Invalid director ID" });
    }

    const { name, age, email, password } = req.body;
    if (!name && !age && !email && !password) {
        return res.status(400).json({ message: "At least one field is required to update" });
    }

    // const filePath = req.file.path

        

    const updatedDirector = await Director.findByIdAndUpdate(
        id, 
        req.body, 
        // { avatar: filePath },
        { new: true } 
    );

    res.status(200).json({ message: "Updated successfully", data: updatedDirector });
});

module.exports = directorsRouter;