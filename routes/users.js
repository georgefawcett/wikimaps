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

  router.post("/createlist", (req,res) => {
    // console.log("in create list post handler");
    // console.log((knex("lists")
    //   .returning('id')
    //   .insert({
    //     title: req.body.title,
    //     description: req.body.desc,
    //     user_id: 14,
    //     privacy: req.body.privacy,
    //     date_created: req.body.date_created
    //   }).toString()));
    (knex('lists')
      .returning('id')
      .insert({
        title: req.body.title,
        description: req.body.desc,
        user_id: 14,
        privacy: req.body.privacy,
        date_created: req.body.date_created
      })
      .then((id)=>{
        console.log(id);
        res.statusCode = 200;
        res.send(id);
      }));
      // .catch((err)=>{
      //   res.statusCode=409;
      //   res.send(err);
      // }));
  });

  router.get("/:listid/addpoints", (req, res) => {
    // console.log(knex
    // .column('title','description','privacy')
    // .where({id:req.params.listid})
    // .select()
    // .from('lists').toString());

    knex
    .column('title','description','privacy')
    .where({id:req.params.listid})
    .select()
    .from('lists')
    .then((row) => {
      res.render("newlist",{listid:req.params.listid, title: row[0].title, desc: row[0].description, privacy: row[0].privacy, cookie: req.session.user});
    })

  })

  router.post("/addpoints", (req, res) => {
    // console.log((knex("points")
    //   .returning(['id','name','description','address'])
    //   .insert({
    //     x: req.body.x,
    //     y: req.body.y,
    //     name: req.body.name,
    //     description: req.body.desc,
    //     list_id: req.body.listid,
    //     added_date: req.body.added_date,
    //     updated_date: req.body.updated_date
    //   }).toString()));

      knex("points")
      .returning(['id','name','description','address'])
      .insert({
        x: req.body.x,
        y: req.body.y,
        name: req.body.name,
        description: req.body.desc,
        list_id: req.body.listid,
        added_date: req.body.added_date,
        updated_date: req.body.updated_date,
        address: req.body.address
      })
      .then((ptDetails)=>{
        res.send(ptDetails);
      })


  })

  return router;

}
