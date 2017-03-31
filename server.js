"use strict";

require('dotenv').config();

const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || "development";
const express     = require("express");
const bodyParser  = require("body-parser");
const sass        = require("node-sass-middleware");
const app         = express();
const router  = express.Router();

const knexConfig  = require("./knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const morgan      = require('morgan');
const knexLogger  = require('knex-logger');

// Seperated Routes for each Resource
const usersRoutes = require("./routes/users");

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

// Mount all resource routes
app.use("/api/users", usersRoutes(knex));

// Home page
app.get("/", (req, res) => {
  if (req.session.user_id) {
    knex
      .select("*")
      .from("lists")
      .where("user_id", req.session.user.id)
      .then((results) => {
        const templateVars = { cookie: req.session.user,
                                lists: results };
    res.render("dashboard", templateVars);
    });

  } else {
  res.render("index");
  }
});

app.get("/home", (req, res) => {
  if (req.session.user) {
    const templateVars = { cookie: req.session.user };
    res.render("dashboard", templateVars);
  } else {
  res.redirect("/login");
  }
});


// Login page - form
app.get("/login", (req, res) => {
  res.render("login");
});

// Login page - action

app.post("/login", (req, res) => {

   knex
      .select("*")
      .from("users")
      .where("email", req.body.email)
      .then(function(results) {
        const bcrypt = require('bcrypt');
        if (bcrypt.compareSync(req.body.password, results[0].password)) {

          req.session.user = {"id": results[0].id,
                              "name": results[0].name
                            };

          res.redirect("/");
         }


  });

    });

// List page
app.get("/lists/:listID", (req, res) => {
  knex
      .select("*")
      .from("lists")
      .where("id", req.params.listID)
      .then((listresults) => {
            knex
            .select("*")
            .from("points")
            .where("list_id", req.params.listID)
                .then((results) => {
                              const templateVars = { cookie: req.session.user,
                                points: results,
                                list: listresults };
                        res.render("lists", templateVars);
                  });

        });

});

// Logout
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/login");
});


// Register page
app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {

  if (!req.body.name || !req.body.email || !req.body.password) {
    // const userID = req.session.user_id;
    // const templateVars = { urls: urlDatabase, user: users[userID], error: "missingreginfo" };
    // res.status(400).render("urls_error", templateVars);
  } else {
    const bcrypt = require('bcrypt');
    const hashed_password = bcrypt.hashSync(req.body.password, 10);
     var newUser = knex
      .insert({name: req.body.name,
               email: req.body.email,
               image: req.body.image,
               password: hashed_password})
      .returning("id")
      .into("users")
      .then(function (id) {
        req.session.user = {"id": id,
                              "name": req.body.name
                            };

    res.redirect("/");
    });

    }


});

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
