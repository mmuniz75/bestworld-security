require('../config/config');

const list = async (token) => {

    const axios = require('axios');

    try{

      const response = await axios.post(`${process.env.GOOGLE_API_URL}/getAccountInfo?key=${process.env.FIREBASE_KEY}`,{"idToken":token});

      const email = response.data.users[0].email;
      const id = response.data.users[0].localId;
      let role = null;  
      
      const responseRole = await axios.get(`${process.env.FIREBASE_SERVER}/usuarios.json?orderBy="email"&equalTo="${email}"&auth=${token}`);

      Object.keys(responseRole.data).map(key => {
        const userData = responseRole.data[key];
        role = userData.role;
      });    

      let url = `${process.env.FIREBASE_SERVER}/usuarios.json?auth=${token}`;
      
      if(role === 'editor' ) {
        url = url + `&orderBy="creatorId"&equalTo="${id}"`;
      }else if (role !== 'admin') {
        throw new Error('Not have access for this service');
      }
      
      const responseUsers = await axios.get(url);

      const users = [];
      Object.keys(responseUsers.data).map(key => {
        const userData = responseUsers.data[key];
        const user = {email: userData.email,
                      role: userData.role};
        users.push(user);              
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
