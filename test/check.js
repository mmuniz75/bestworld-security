require('../config/config');

var admin = require("firebase-admin");

admin.initializeApp({
    credential: admin.credential.cert({
      projectId: 'bestworld-eaa92',
      clientEmail: process.env.CLIENT_EMAIL,
      privateKey: process.env.PRIVATE_KEY
    }),
    databaseURL: "https://bestworld-eaa92.firebaseio.com"
  });

  admin.auth().getUserByEmail('betterworldemail@gmail.com').then((user) => {
    // Add incremental custom claim without overwriting existing claims.
    const currentCustomClaims = user.customClaims;
    if (currentCustomClaims.admin) {
      console.log('admin');
    }

    if (currentCustomClaims.editor) {
      console.log('editor');
    }

  }).catch((error) => {
    console.log(error);
  });
