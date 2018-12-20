require('./config/config');


const express = require('express');
const bodyParser = require('body-parser');

const loginService = require('./services/login');
const usersService = require('./services/usersSave');
const usersService2 = require('./services/users');
const usersService3 = require('./services/usersDelete');

var app = express();
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", '*');
  res.header("Access-Control-Allow-Credentials", true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,PATCH,POST,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json,access-token');
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

app.post('/users/:email/password/reset', async (req, res) => {
  try{ 
    const login = await loginService.resetPassword(req.params.email);
    res.send(200);
  }catch(e){
    res.status(400).send({"error" :e.message});   
  }
}, (e) => {
    res.status(400).send(e);
});

app.post('/users', async (req, res) => {
  try{ 
    const response = await usersService.create(req.body.user,req.body.password,req.body.role,req.header('access-token'));
    res.status(201).send(response);
  }catch(e){
    res.status(400).send({"error" :e.message});   
  }
}, (e) => {
    res.status(400).send(e);
});

app.patch('/users/:email', async (req, res) => {
  try{ 
    const response = await usersService.updateRole(req.params.email,req.body.role,req.header('access-token'));
    res.status(200).send(response);
  }catch(e){
    res.status(400).send({"error" :e.message});   
  }
}, (e) => {
    res.status(400).send(e);
});

app.get('/users', async (req, res) => {
  try{ 
    const usersResponse = await usersService2.list(req.header('access-token'));
    res.send(usersResponse);
  }catch(e){
    res.status(400).send({"error" :e.message});   
  }
}, (e) => {
    res.status(400).send(e);
});

app.delete('/users/:email', async (req, res) => {
  try{ 
    const usersResponse = await usersService3.delete(req.params.email,req.header('access-token'));
    res.status(200).send();   
  }catch(e){
    res.status(400).send({"error" :e.message});   
  }
}, (e) => {
    res.status(400).send(e);
});

app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});
