"use strict";

require('dotenv').config();

const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || "development";
const express     = require("express");
const bodyParser  = require("body-parser");
const sass        = require("node-sass-middleware");
const app         = express();

const knexConfig  = require("./knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const morgan      = require('morgan');
const knexLogger  = require('knex-logger');


const cookieSession = require('cookie-session')
app.use(cookieSession({
  name: 'session',
  keys: ['user_id'], //
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

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
    const templateVars = { name: "George" };
    res.render("dashboard", templateVars);
  } else {
  res.render("index");
  }
});

// Login page - form
app.get("/login", (req, res) => {
  res.render("login");
});

// Login page - action
// app.post("/login", (req, res) => {
//   const bcrypt = require('bcrypt');
//   var match = 0;
//   for (var user in users) {
//     if (users[user].email === req.body.email && bcrypt.compareSync(req.body.password, users[user].password)) {
//       req.session.user_id = user;
//       match++;
//     }
//   }
//   if (match === 0) {
//     const userID = req.session.user_id;
//     const templateVars = { urls: urlDatabase, user: users[userID], error: "userpasscombo" };
//     res.status(403).render("urls_error", templateVars);
//   } else {
//     res.redirect("/urls");
//   }
// });


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
        return console.log(id, req.body.name, req.body.email, req.body.image, req.body.password);
    });
      req.session.user_id = newUser;
    }

  res.redirect("/");
});




app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
