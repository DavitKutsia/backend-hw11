const express = require("express");
const connectToDb = require("./db/db");
const directorsRouter = require("./director/director.router");
const filmsRouter = require("./film/film.router");

const app = express();
app.use(express.json());

connectToDb();

app.use("/directors", directorsRouter);
app.use("/films", filmsRouter);

app.listen(3000, () => {
    console.log("🚀 Server running at http://localhost:3000");
});
