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
    //     user_id: req.session.user.id,
    //     privacy: req.body.privacy,
    //     date_created: req.body.date_created
    //   }).toString()));
    (knex('lists')
      .returning('id')
      .insert({
        title: req.body.title,
        description: req.body.desc,
        user_id: req.session.user.id,
        privacy: req.body.privacy,
        date_created: req.body.date_created,
        image: req.body.image_url
      })
      .then((listid)=>{
        // console.log(listid);
        res.statusCode = 200;
        res.send(listid);
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
    .column('id','title','description','privacy','user_id')
    .where({id:req.params.listid})
    .select()
    .from('lists')
    .then((row) => {
      res.render("newlist",{listid: row[0].id,title: row[0].title, desc: row[0].description, privacy: row[0].privacy, author: row[0].user_id, points: [], cookie: req.session.user});
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
    .returning(['id','name','description','address','added_date'])
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
    .then((ptDetails) => {
      console.log(req.session.user.id, req.body.author);
      if(req.session.user.id != req.body.author){
        console.log(knex('contributors')
        .insert({
          user_id: req.session.user.id,
          list_id: req.body.listid
        }).toString());

        knex('contributors')
        .insert({
          user_id: req.session.user.id,
          list_id: req.body.listid
        }).then(()=>{
          res.send(ptDetails);
        });
      } else {
        res.send(ptDetails);
      }
    })
  })

  router.post("/deletepoint", (req, res) => {
    // console.log(knex('points')
    //   .where("id", req.body.id)
    //   .del().toString());

    knex('points')
      .where("id", req.body.id)
      .del()
    .then(()=>{
      res.send("success");
    });
  });

  router.get("/:listid/editList", (req,res) => {
    //console.log(req.params.listid);
    //res.redirect("/api/users/"+req.params.listid+"/addpoints");
    knex
    .column('id','title','description','privacy','user_id')
    .where({id:req.params.listid})
    .select()
    .from('lists')
    .then((row) => {
      knex
      .column('id','name','description','address','added_date')
      .where({list_id:req.params.listid})
      .select()
      .from('points')
      .then((pts) => {
        //console.log(rows.length);
        res.render("newlist",{listid: row[0].id,title: row[0].title, desc: row[0].description, privacy: row[0].privacy, author:row[0].user_id, points: pts, cookie: req.session.user});
      });
    })
  });

  router.post("/deletelist", (req,res) => {
    // console.log(knex('points')
    // .where("list_id",req.body.id)
    // .del().toString());

    knex('points')
    .where("list_id",req.body.id)
    .del()
    .then(()=>{

      // console.log(knex('lists')
      // .where("id",req.body.id)
      // .del().toString());

      knex('lists')
      .where("id",req.body.id)
      .del()
      .then(() => {
        res.statusCode = 200;
        res.send("deleted");
      })
    })
  })

  router.post("/savefavourite", (req,res) => {
    knex('favourites')
    .insert({
      user_id: req.session.user.id,
      list_id: req.body.id
    })
    .then(() => {
      res.send("success");
    });
  })
  return router;

}
