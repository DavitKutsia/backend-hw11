const express = require("express");
const connectToDb = require("./db/db");
const directorsRouter = require("./director/director.router");
const filmsRouter = require("./film/film.router");
const authRouter = require("./auth/auth.router");
const isAuth = require("./middlewares/isAuth.middleware");
const cors = require("cors");

connectToDb();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World');
});
    
app.use("/directors", isAuth, directorsRouter);
app.use("/films", isAuth, filmsRouter);
app.use("/auth", authRouter);

app.listen(3000, () => {
    console.log("🚀 Server running at http://localhost:3000");
});
