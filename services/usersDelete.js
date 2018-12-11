require('../config/config');

const remove = async (email,token) => {

    const axios = require('axios');
    const userUtil = require('./userUtil');
    const Blowfish = require('blowfish-security-lib');

    const Blowfish = require('blowfish-security-lib');

    try{

      const creator = await userUtil.getUser(token);
                  
      const userDetail = await axios.get(`${process.env.FIREBASE_SERVER}/usuarios.json?orderBy="email"&equalTo="${email}"&auth=${token}`);
      
      if (creator.role !== 'admin' && userDetail.creatorId!= creator.id) {
        throw new Error('Not grant to delete this user');
      }

      const bf = new Blowfish(process.env.SECRET_KEY);
      const password = bf.decrypt(userDetail.password);
      const user = await userUtil.getToken(email,password);
      const authData = {idToken: user.token};      

      const responseAuth = await axios.post(`${process.env.GOOGLE_API_URL}/deleteAccount?key=${process.env.FIREBASE_KEY}`,authData);
          
    }catch(e) {
        let message = e.response && e.response.data && e.response.data.error?e.response.data.error.message:e.message;
        throw new Error(message);
    };

};

module.exports.delete = remove;
