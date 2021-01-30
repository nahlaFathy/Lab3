const express = require('express');
const app = express();
const port = 3000;
const path = require('path')
const todos=require('./routes/todos')
const view=require('./routes/view')


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/todo',todos)
app.use('/',view)

///////PUG Temp//////////

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// a middleware that logs the request url, method, and current time 

app.use((req, res, next) => {
  var time = new Date();
  console.log('Time:', time.getHours(), ':', time.getMinutes(), ':', time.getSeconds())
  console.log('Method:', req.method)
  console.log('URL:', req.url)
  next()
})

// a global error handler that logs the error 

app.use((err,req, res, next) => {
  console.error(err)
  res.status(500).send({ error: 'internal server error' })
  next(err);
});


app.listen(port)


