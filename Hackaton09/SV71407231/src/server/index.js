const express = require("express");
const { syncDB } = require("../config/db");

const userRoutes = require("../routes/user.routes");
const courseRoutes = require("../routes/course.routes");
const lessonRoutes = require("../routes/lesson.routes");

const app = express();

require("../models");

app.use(express.json());

app.use("/users", userRoutes);
app.use("/courses", courseRoutes);
app.use("/lessons", lessonRoutes);
app.use("/enrollments", require("../routes/enrollments.routes"));
app.use("/comments", require("../routes/comments.routes")); 


async function start() {
    await syncDB();
    app.listen(process.env.PORT || 3000, () => {
        console.log("Servidor iniciado en puerto", process.env.PORT || 3000);
    });
}

start();