const express=require('express');
const router=express.Router();
const list=require('../db.json')
router.get("/", (req, res) => {
    res.render('index', {
      Todo: list
    });
  });

module.exports=router;