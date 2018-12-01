require('../config/config');

const login = async (email,password) => {

    const axios = require('axios');

    const authData = {
      email: email,
      password: password,
      returnSecureToken: true
    };

    let user = {};
    
    try{
      const responseAuth = await axios.post(`${process.env.GOOGLE_API_URL}/verifyPassword?key=${process.env.FIREBASE_KEY}`,authData);

      user = {
        token: responseAuth.data.idToken,
        id:responseAuth.data.localId,
        expiresIn: responseAuth.data.expiresIn,
        role: "default"
      };

      const resonseUser = await axios.get(`${process.env.FIREBASE_SERVER}/usuarios.json?orderBy="email"&equalTo="${authData.email}"&auth=${user.token}`);

      Object.keys(resonseUser.data).map(key => {
        const userData = resonseUser.data[key];
        user.role = userData.role;
      });    

      return {"user": user};
          
    }catch(e) {
        const message = e.response.data.error.message?e.response.data.error.message:e.response.data.error;
        throw new Error(message);
    };

};

module.exports.login = login;
