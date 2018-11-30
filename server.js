require('./config/config');


const express = require('express');
const bodyParser = require('body-parser');
const loginService = require('./services/login');

var app = express();
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", '*');
  res.header("Access-Control-Allow-Credentials", true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
  next();
});

const port = process.env.PORT;

app.post('/login', async (req, res) => {

  try{ 
    const login = await loginService.login(req.body.user,req.body.password);
    res.send(login.user);
  }catch(e){
    res.status(400).send({"error" :e.message});   
  }
    
}, (e) => {
    res.status(400).send(e);
});

app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});
