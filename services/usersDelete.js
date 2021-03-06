require('../config/config');

const axios = require('axios');
const userUtil = require('./userUtil');
const Crypto = require('cryptr');
const emailService = require('../util/email')


const remove = async (email,token) => {

    
    try{

      const creator = await userUtil.getUser(token);
                  
      const userDetailGet = await axios.get(`${process.env.FIREBASE_SERVER}/usuarios.json?orderBy="email"&equalTo="${email}"&auth=${token}`);

      let userDetail = null;

      await Object.keys(userDetailGet.data).map(key => {
        userDetail = {
          id: key,
          password: userDetailGet.data[key].password,
          creatorId: userDetailGet.data[key].creatorId
        };
      });
            
      if (creator.role !== 'admin' && userDetail.creatorId!= creator.id) {
        throw new Error('Not grant to delete this user');
      }
      if(userDetail === null) {
        throw new Error('User not found');
      }
      
      try{
        if(!userDetail.password){
          throw new Error('INVALID_PASSWORD');
        }
        const cryptr = new Crypto(process.env.SECRET_KEY);
        let password = cryptr.decrypt(userDetail.password);
        const user = await userUtil.getToken(email,password);
        const authData = {idToken: user.token};      
        await axios.post(`${process.env.GOOGLE_API_URL}/deleteAccount?key=${process.env.FIREBASE_KEY}`,authData);
  
      }catch(e){
        if( !e.response || e.response.data.error.message!=='INVALID_PASSWORD'){
          if(e.message!=='INVALID_PASSWORD')
            throw e;
        }  
        console.log(`Email ${email} precisa ser removido manualmente`); 
        emailService.send(email); 
      }  

      await axios.delete(`${process.env.FIREBASE_SERVER}/usuarios/${userDetail.id}.json?auth=${token}`);
          
    }catch(e) {
        let message = e.response && e.response.data && e.response.data.error?e.response.data.error.message:e.message;
        throw new Error(message);
    };

};

module.exports.delete = remove;
