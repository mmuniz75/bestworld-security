require('../config/config');

const create = async (email,password,role,token) => {

    const axios = require('axios');
    const userUtil = require('./userUtil');

    const Crypto = require('cryptr');

    validation(email,password,role);

    try{

      const creator = await userUtil.getUser(token);

      checkRoke(creator.role,role);
  
      const authData = {
        email: email,
        password: password,
        returnSecureToken: true
      };

      let user = {};
    
      const responseUser = await axios.post(`${process.env.GOOGLE_API_URL}/signupNewUser?key=${process.env.FIREBASE_KEY}`,authData);

      const cryptr = new Crypto(process.env.SECRET_KEY);
      var encrypted = cryptr.encrypt(password);
      
      user = {
        email: email,
        role: role,
        creatorId:creator.id,
        password: encrypted
      };

      const resonseRole = await axios.post(`${process.env.FIREBASE_SERVER}/usuarios.json?&auth=${token}`,user);
      
      return {"id": resonseRole.data.name};
          
    }catch(e) {
        let message = e.response && e.response.data && e.response.data.error?e.response.data.error.message:e.message;
        throw new Error(message);
    };

};

const validation = (email,password,role) => {
  if(!email)
    throw new Error("USER_REQUIRED");

  if(!password)
    throw new Error("PASSWORD_REQUIRED");
  
  if(!role)
    throw new Error("ROLE_REQUIRED");

  if(role !== 'admin' && role !== 'editor' && role !== 'default')  
    throw new Error("role should be : admin or editor or default");
}

const checkRoke = (roleCreator,role) => {
  
  if(roleCreator === 'admin')
    return true;

  if(roleCreator === 'editor' && (role === 'editor' || role === 'default') )
    return true;
   
  if(roleCreator === 'default' && role === 'default')
    return true;  

  throw new Error("ROLE_FORBIDDEN");  

}

module.exports.create = create;
