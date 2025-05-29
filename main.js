const express = require("express");
const connectToDb = require("./db/db");
const directorsRouter = require("./director/director.router");
const filmsRouter = require("./film/film.router");
const authRouter = require("./auth/auth.router");
const isAuth = require("./middlewares/isAuth.middleware");
const cors = require("cors");
// const multer = require("multer");
// const upload = require("./config/cloudinary.config");

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads')
//     },
//     filename: function (req, file, cb) {
//         cb(null, Date.now() + '-' + file.extname(file.originalname))
//     }
// })


connectToDb();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('uploads'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Hello World');
});
    
app.use("/directors", isAuth, directorsRouter);
app.use("/films", isAuth, filmsRouter);
app.use("/auth", authRouter);


app.listen(3000, () => {
    console.log("🚀 Server running at http://localhost:3000");
});
