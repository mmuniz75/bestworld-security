require('./config/config');

const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());

const port = process.env.PORT;

app.post('/login', (req, res) => {

  const authData = {
    email: req.body.user,
    password: req.body.password,
    returnSecureToken: true
  };

  let user = {};
   
  axios.post(process.env.AUTH_URL,authData).then((response) => {
  
    const expirationDate = new Date(new Date().getTime() + response.data.expiresIn * 1000);

    user = {
      token: response.data.idToken,
      id:response.data.localId,
      expirationDate: expirationDate,
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
