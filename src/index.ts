import express from "express";
import convertRouter from "./routes/index";

const app = express();
const port = 3000;

app.get("/", (req, res) => {
    res.redirect("/convert");
});

app.use("/convert", convertRouter);

// start the Express server
app.listen(port, () => {
    const time = new Date().toLocaleString("en-US");
    console.log(`[${time}] server started at http://localhost:${port}`);
});
