require('../config/config');

const login = async (email,password) => {

    const userUtil = require('./userUtil');
    
    try{
      const user = await userUtil.getToken(email,password);
      
      user.role = await userUtil.getRole(email,user.token);

      if(user.role === 'disable') {
          throw new Error("USER_DISABLED")
      }
      return {"user": user};
          
    }catch(e) {
        let message = e.message;
        
        if(e.response) {
            message = e.response.data.error.message?e.response.data.error.message:e.response.data.error;
        }    
        throw new Error(message);
    };

};

module.exports.login = login;
