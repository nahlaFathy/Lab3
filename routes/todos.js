const express=require('express');
const router=express.Router();
var obj;
const fs = require('fs');

///////////////////////////////////1////////////////////////////////////

  router.get('/', function (req, res) {
  fs.readFile('db.json', 'utf8', function readFileCallback(err, data) {
      if (err) return res.status(404).send({ Error: 'File i not Found' })
  
      else return res.send('List of todos :' + (data))
  
  
    })
  })

  
  /////////////////////////////2////////////////////////////////////
  router.get('/:username', (req, res) => {
    fs.readFile('db.json', 'utf8', function readFileCallback(err, data) {
      if (err) return res.status(404).send({ Error: 'File is not Found' })
      else {
        obj = JSON.parse(data);
        const myUser = obj.find(user => user.username === req.params.username)
        const index=obj.indexOf(myUser)
        if(!myUser)return res.send({error:'this username is not found'})
        else return res.send('List of todos for user name:' + req.params.username + ' is :' +
          JSON.stringify(obj[index]));

      }});
  });
  
  
  
  //////////////////////////////////3///////////////////////////
  router.post('/add-todo', (req, res) => {
  
    fs.readFile('db.json', 'utf8', function readFileCallback(err, data) {
      if (err) return res.status(404).send({ Error: 'File is not Found' })
      else {
        obj = JSON.parse(data);
        const myUser = obj.find(user => user.username === req.body.username)
        console.log(obj)
        if (!myUser) return res.send({ Error: 'this user is not exist' })
        else {
          obj.push({ username: req.body.username, title: req.body.title }); //add some data
          var json = JSON.stringify(obj);//convert it back to json
          fs.writeFile('db.json', json, (err) => {
            if (err) return res.send(err)
            else return res.send({ message: "todo created successfuly" })
          });
        }
  
      }
    });
  
  
  })
  ///////////////////////////4//////////////////////////////////
  
  router.delete('/delete/:id', (req, res) => {
  
    fs.readFile('db.json', 'utf8', function readFileCallback(err, data) {
      if (err) return res.status(404).send({ Error: 'File is not Found' })
      else {
        obj = JSON.parse(data);
        const myUser = obj.find(user => user.id === req.params.id)
        const index=obj.indexOf(myUser)
        if(!myUser)return res.send({error:'this id is not found'})
        else
        {
          obj.splice(index, 1)
          var json = JSON.stringify(obj);//convert it back to json
          fs.writeFile('db.json', json, (err) => {
            if (err)return res.send(err)
            else return res.send({ message: "todo deleted successfuly" })
          });
        }     
      }
    });
  });
  
  ////////////////////////////////////5//////////////////////////////
  router.patch('/update/:id', (req, res) => {
  
    fs.readFile('db.json', 'utf8', function readFileCallback(err, data) {
      if (err) return res.status(404).send({ Error: 'File is not Found' })
      else {
        if (req.body.title  && req.body.status ) {
          obj = JSON.parse(data);
          const myUser = obj.find(user => user.id === req.params.id)
        const index=obj.indexOf(myUser)
        if(!myUser)return res.send({error:'invalid attributes'})
        else {
            obj[index].title = req.body.title
            obj[index].status = req.body.status
            var json = JSON.stringify(obj);//convert it back to json
            fs.writeFile('db.json', json, (err) => {
              if (err) return res.send(err)
              else return res.send({ message: "todo updated successfuly" })
            });
          }
  
  
        }
        else res.send({ message: "undefined request parameters" })
  
      }
    })
  })
  //////////////////////////////////////6////////////////////////////
  
  const { body, validationResult } = require('express-validator');
  router.post('/register',
    body('username').isLength({ min: 1 })
      .withMessage('username is required'),
    body('password').isLength({ min: 1 })
      .withMessage('password is required')
    , body('firstname').isLength({ min: 1 })
      .withMessage('firstname is required')
    , (req, res) => {
     
      fs.readFile('db.json', 'utf8', function readFileCallback(err, data) {
        if (err) return res.status(404).send({ Error: 'File is not Found' })
        else {
          const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions
  
          if (!errors.isEmpty()) return res.status(422).send({error: errors.errors[0].msg });        
  
          obj = JSON.parse(data);
          obj.push({ username: req.body.username, password: req.body.password, firstname: req.body.firstName }); //add some data
          var json = JSON.stringify(obj);//convert it back to json
          fs.writeFile('db.json', json, (err) => {
            if (err) return res.send(err)
            else return res.send({ message: "user was registered successfully" })
          });
  
        }
      });
  
  
    })
  
  
  ///////////////////////////////////////// 7 /////////////////////////////
  
  
  
  router.post(
    '/login',(req, res) => {
      fs.readFile('db.json', 'utf8', function readFileCallback(err, data) {
        if (err) return res.status(404).send({ Error: 'File is not Found' })
        else {
          if (req.body.username  && req.body.password ) {
            obj = JSON.parse(data);
            const myUser = obj.find(user => user.username === req.body.username && user.password===req.body.password)
            const index=obj.indexOf(myUser)
          if(!myUser)return res.status(401).send({error:'invalid credentials'})
          else
          {
            obj[index].loggedin = "True"
            var json = JSON.stringify(obj);//convert it back to json
            fs.writeFile('db.json', json, (err) => {
              if (err) return res.send(err)
              else return res.send({message: "logged in successfully", profile:{name:req.body.username}})
            });   
          }
  
        }
        else return res.send({error:'u should enter uasername and password '})
      
      }
    }
  )})
  
  module.exports=router