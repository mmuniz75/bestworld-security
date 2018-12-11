require('../config/config');

const login = async (email,password) => {

    const axios = require('axios');
    const userUtil = require('./userUtil');

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

      user.role = await userUtil.getRole(authData.email,user.token);

      return {"user": user};
          
    }catch(e) {
        const message = e.response.data.error.message?e.response.data.error.message:e.response.data.error;
        throw new Error(message);
    };

};

module.exports.login = login;
