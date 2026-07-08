const express = require("express");
const path = require("path");
const hbs = require("hbs"); 
const { title } = require("process");
const { deserialize } = require("v8");

const app = express();
const port = 3000;

//handlebarr
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

//static file
app.use(express.static(path.join(__dirname, "assets")));


//route
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/contact", (req, res) => {
  res.render("contact");
});

app.get("/project", (req, res) => {
  const projects = [
    {id: 1, title: 'Project A', description: 'Description A'},
    {id: 2, title: 'Project B', description: 'Description B'},
    {id: 3, title: 'Project C', description: 'Description C'},
  ];

  res.render("project", {projects});
});



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
  
});