require('../config/config');

const list = async (token) => {

    const axios = require('axios');
    const userUtil = require('./userUtil');

    try{

      const user = await userUtil.getUser(token)
      
      let url = `${process.env.FIREBASE_SERVER}/usuarios.json?auth=${token}`;
      
      if(user.role === 'editor' ) {
        url = url + `&orderBy="creatorId"&equalTo="${user.id}"`;
      }else if (user.role !== 'admin') {
        throw new Error('Not have access for this service');
      }
      
      const responseUsers = await axios.get(url);

      const users = [];
      Object.keys(responseUsers.data).map(key => {
        const userData = responseUsers.data[key];

        if(userData) {
          const user = {email: userData.email,
                        role: userData.role};
          users.push(user);              
          }  
      }); 
      
      return users;
          
    }catch(e) {
        let message = e.response && e.response.data && e.response.data.error && e.response.data.error.message
        ?e.response.data.error.message:e.response && e.response.data && e.response.data.error
        ?e.response.data.error:e.message;
                
        throw new Error(message);
    };

};

module.exports.list = list;
