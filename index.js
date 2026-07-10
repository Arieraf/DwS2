const pool = require("./config/db");
const express = require("express");
const path = require("path");
const hbs = require("hbs"); 
const session = require("express-session");


const app = express();
const port = 3000;

//middleware
app.use(express.urlencoded({extended: true}));
//session
app.use(session({
  secret: "my-secret-key",
  resave: false,
  saveUninitialized: false,
}));

app.use((req, res, next) => {

    res.locals.flash = req.session.flash;

    delete req.session.flash;

    next();

});
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

// app.get("/project", (req, res) => {
//   res.render("project", {projects});
// });

app.get("/project", async (req, res)=>{
  try {
    const result = await pool.query("select * from projects order by id_projects asc");

    res.render("project", {
      projects: result.rows,
    });
  } catch(error) {
    console.error(error);
    res.send("Ada Kesalahan saat mengambil Data");
  }
});




app.post ("/project", async (req, res)=>{
  
  const {
    project_name,
    description,
    start_date,
    end_date,
    image
  } = req.body;

  try{
    await pool.query(`insert into projects
      (project_name,
        description,
        start_date,
        end_date,
        image
      )
      values ($1, $2, $3, $4, $5)
      `,
      [
        project_name,
        description,
        start_date,
        end_date,
        image
      ]

      
    );
    
      req.session.flash = {
      type: "success",
      message: "Project berhasil ditambah."
      };
      
      res.redirect("/project");

  } catch (error) {
    console.error(error);
    req.session.flash = {
    type: "error",
    message: "Gagal menambahkan project."
    };

    res.redirect("/project");

  }
  });




//EDIT
app.get("/project/edit/:id", async (req, res) => {
    try {

        const { id } = req.params;

        const result = await pool.query(
            `
            SELECT *
            FROM projects
            WHERE id_projects = $1
            `,
            [id]
        );

        res.render("edit-project", {
            project: result.rows[0]
        });

    } catch (error) {

        console.error(error);
        res.send("Project tidak ditemukan.");

    }
});


app.post("/project/edit/:id", async (req, res) => {

    try {

        const { id } = req.params;

        const {
            project_name,
            description,
            start_date,
            end_date,
            image
        } = req.body;

      if (
          !project_name ||
          !description ||
          !start_date ||
          !end_date
      ) {
      return res.send("Semua data wajib diisi.");
      res.redirect("/project");
      }   

        await pool.query(
            `
            UPDATE projects
            SET
                project_name = $1,
                description = $2,
                start_date = $3,
                end_date = $4,
                image = $5
            WHERE id_projects = $6
            `,
            [
                project_name,
                description,
                start_date,
                end_date,
                image,
                id
            ]
        );

       res.redirect("/project");

    } catch (error) {
        console.error(error);
        res.send("Gagal mengubah project.");
        // res.redirect("/project");

    }

});



//DELETE
app.get("/project/delete/:id", async (req,res)=>{
  try {
      const {id} = req.params; 

      await pool.query(
        `
        delete from projects
        where id_projects = $1
        `,
        [id]
      );
      
      req.session.flash = {
      type: "success",
      message: "Project berhasil dihapus."
      };
      
      res.redirect("/project");

  } catch (error){
    console.error(error);
    req.session.flash = {
    type: "error",
    message: "Gagal menghapus project."
};

res.redirect("/project");
  }

});

//GET
app.get("/project/:id", async (req, res) => {
  
  try {
    const {id} = req.params;
    const result = await pool.query(
    `
    select * from projects where id_projects =$1
    `,
    [id]
  );

  const project = result.rows[0];
  
  res.render ("project-detail", {project});
  
  }catch (error){
    console.error(error);
    res.send("Project tidak Ditemukan");
  }

});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
  
});