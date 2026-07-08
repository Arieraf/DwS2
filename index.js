const express = require("express");
const path = require("path");
const hbs = require("hbs"); 
const { title } = require("process");
const { deserialize } = require("v8");
const { ECDH } = require("crypto");

const app = express();
const port = 3000;

//middleware
app.use(express.urlencoded({extended: true}));
//handlebarr
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

//static file
app.use(express.static(path.join(__dirname, "assets")));

let projects = [];

//route
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/contact", (req, res) => {
  res.render("contact");
});

app.get("/project", (req, res) => {
  res.render("project", {projects});
});

app.post ("/project", (req, res)=>{
  console.log(projects);
  const {
    projectName,
    startDate,
    endDate,
    image
  } = req.body;

  const project = { 
    id: Date.now(),
    projectName,
    startDate,
    endDate,
    image
  };

  projects.push(project);

  res.redirect("/project");
});

//GET
app.get("/project/:id", (req, res) => {
  const {id} = req.params;
  const project = projects.find(project => project.id == id);

  res.render ("project-detail", {project})
});

//EDIT
app.get("/project/edit/:id", (req,res)=>{
  const {id} = req.params;
  const project = projects.find(project => project.id == id);

  res.render("edit-project",{
    project
  });
});

app.post("/project/edit/:id", (req, res) => {
  const {id} = req.params;
  const {
    projectName,
    startDate,
    endDate,
    image
  } = req.body;

  const project =  projects.find(project => project.id == id);
  project.projectName = projectName;
  project.startDate = startDate;
  project.endDate = endDate;
  project.image = image

  res.redirect("/project");
});

//DELETE
app.get("/project/delete/:id", (req,res)=>{
  const {id} = req.params;
  projects = projects.filter(project => project.id !=id);
  res.redirect("/project");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
  
});