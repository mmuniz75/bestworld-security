require('./config/config');

const express = require('express');

var app = express();
const port = process.env.PORT;

app.get('/login', (req, res) => {
    const user = {
        token: "123456789",
        editor: true
    }
    res.send(user);
  }, (e) => {
    res.status(400).send(e);
});


app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});

