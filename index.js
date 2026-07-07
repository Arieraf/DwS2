const express = require("express");
const path = require("path");
const hbs = require("hbs"); 

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
  res.render("project");
});



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
  
});