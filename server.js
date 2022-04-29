const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express(); 

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());

const port = 8080;
app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});


app.get("/api", (req, res) => {
    console.log("got request");
    fs.readFile("data.json", "utf-8", (err, data) => {
        res.send(data);
    })
});

app.get("/", (req, res) => {
    console.log("got home request");
    res.send("home for jobs api");
})