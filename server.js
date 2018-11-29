require('./config/config');

const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

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

app.post('/login', (req, res) => {

  const authData = {
    email: req.body.user,
    password: req.body.password,
    returnSecureToken: true
  };

  let user = {};
   
  axios.post(process.env.AUTH_URL,authData).then((response) => {

    user = {
      token: response.data.idToken,
      id:response.data.localId,
      expirationDate: response.data.expiresIn,
      role: "default"
    }

    return axios.get(`${process.env.FIREBASE_SERVER}/usuarios.json?orderBy="email"&equalTo="${authData.email}"&auth=${user.token}`);

  }).then((response) => {  
    Object.keys(response.data).map(key => {
      const userData = response.data[key];
      user.role = userData.role;
    });

    res.send(user);
        
  }).catch((e) => {
      res.status(e.response.status).send(e.response.data);
  });

}, (e) => {
    res.status(400).send(e);
});

app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});
