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
      console.log('set claim');
      return admin.auth().setCustomUserClaims(user.uid, {
        editor: true
      });
     
  }).catch((error) => {
    console.log(error);
  });