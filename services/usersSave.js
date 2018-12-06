require('../config/config');

const create = async (email,password,role,token) => {

    const axios = require('axios');

    validation(email,password,role);

    try{

      const responseCreator = await axios.post(`${process.env.GOOGLE_API_URL}/getAccountInfo?key=${process.env.FIREBASE_KEY}`,{"idToken":token});

      const creator = {
        email : responseCreator.data.users[0].email,
        id: responseCreator.data.users[0].localId,
        role: "default"
      }
      
      const responseRoleCreator = await axios.get(`${process.env.FIREBASE_SERVER}/usuarios.json?orderBy="email"&equalTo="${creator.email}"&auth=${token}`);

      Object.keys(responseRoleCreator.data).map(key => {
        const userData = responseRoleCreator.data[key];
        creator.role = userData.role;
      });    

      checkRoke(creator.role,role);
  
      const authData = {
        email: email,
        password: password,
        returnSecureToken: true
      };

      let user = {};
    
      const responseUser = await axios.post(`${process.env.GOOGLE_API_URL}/signupNewUser?key=${process.env.FIREBASE_KEY}`,authData);

      user = {
        email: email,
        role: role,
        creatorId:creator.id
      };

      const resonseRole = await axios.post(`${process.env.FIREBASE_SERVER}/usuarios.json?&auth=${token}`,user);
      
      return {"user": resonseRole.data};
          
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
