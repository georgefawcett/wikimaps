"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  router.get("/", (req, res) => {
    knex
      .select("*")
      .from("users")
      .then((results) => {
        res.json(results);
    });
  });

  router.get("/newlist", (req,res) => {
    console.log("get req on /newlist");
    res.render("newlist");
  })

  return router;

}
