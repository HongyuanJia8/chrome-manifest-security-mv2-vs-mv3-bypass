const express = require('express');
const bodyParser = require('body-parser');
const path = require('path')
const db = require('./db');

const cors = require('cors');

const app = express();

app.use(cors())

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.render("index"); // index refers to index.ejs
});


app.get('/report-a-bug', db.createBug);

app.get('/SUPERSECRETDATABASEDEALIO', db.getAllBugs);

app.get('/SUPERSECRETDATABASEDEALIO/table', db.getAllBugsTable);

app.get('/clear-database', db.clearDatabase);

app.get('/create-database', db.createDatabase);

app.listen(3000, () => console.log('Example app is listening on port 3000.'));
