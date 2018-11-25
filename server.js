require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());

const port = process.env.PORT;

var admin = require("firebase-admin");

admin.initializeApp({
    credential: admin.credential.cert({
      projectId: 'bestworld-eaa92',
      clientEmail: process.env.CLIENT_EMAIL,
      privateKey: process.env.PRIVATE_KEY
    }),
    databaseURL: "https://bestworld-eaa92.firebaseio.com"
  });

app.post('/login', (req, res) => {

    let adminStatus = false;
    admin.auth().getUserByEmail('mmunizs1975@gmail.com').then((userAuth) => {
        const currentCustomClaims = userAuth.customClaims;
        if (currentCustomClaims.admin) {
            adminStatus = true
        }
    
      }).catch((error) => {
        console.log(`${error.code}:${error.message}`);
      });

    console.log(req.body);

    const user = {
        token: "123456789",
        admin: adminStatus
    }
    res.send(user);
  }, (e) => {
    res.status(400).send(e);
});

app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});
