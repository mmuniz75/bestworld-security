require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());

const port = process.env.PORT;

app.post('/login', (req, res) => {

    let adminStatus = false;
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
