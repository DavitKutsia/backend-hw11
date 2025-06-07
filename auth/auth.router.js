const { Router } = require('express');
const directorModel = require('../models/director.model');
const bcrypt = require('bcrypt');
const directorSchema = require('../validations/director.schema');
const jwt = require('jsonwebtoken');
const isAuth = require("../middlewares/isAuth.middleware"); // <-- import this
require('dotenv').config();

const authRouter = Router();

authRouter.post('/register', async (req, res) => {
    const { error } = directorSchema.validate(req.body || {});
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    const { name, email, password, age } = req.body;

    const existingDirector = await directorModel.findOne({ email });
    if (existingDirector) {
        return res.status(400).json({ error: 'Director already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await directorModel.create({ name, email, password: hashedPassword, age });

    res.status(201).json({ message: 'Director registered successfully' });
});

authRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    const existingDirector = await directorModel.findOne({ email });
    if (!existingDirector) {
        return res.status(400).json({ error: 'Email and password is invalid' });
    }

    const isPasswordValid = await bcrypt.compare(password, existingDirector.password);
    if (!isPasswordValid) {
        return res.status(400).json({ error: 'Email and password is invalid' });
    }

    const payload = { directorId: existingDirector._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token });
});


authRouter.get('/profile', isAuth, async (req, res) => {
    try {
        const director = await directorModel.findById(req.directorId).select('-password');
        if (!director) {
            return res.status(404).json({ error: 'Director not found' });
        }
        res.status(200).json({ director });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = authRouter;
