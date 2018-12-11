const axios = require('axios');

const getRole = async (email,token) => {

      const resonseUser = await axios.get(`${process.env.FIREBASE_SERVER}/usuarios.json?orderBy="email"&equalTo="${email}"&auth=${token}`);

      let role = "default";

      Object.keys(resonseUser.data).map(key => {
        const userData = resonseUser.data[key];
        role = userData.role;
      });

      return role;
}

const getUser = async (token) => {
    
    const response = await axios.post(`${process.env.GOOGLE_API_URL}/getAccountInfo?key=${process.env.FIREBASE_KEY}`,{"idToken":token});

    const user = {
        email: response.data.users[0].email,
        id: response.data.users[0].localId,
        role: "default"  
    };
        
    user.role = await getRole(user.email,token);

    return user;
}    

module.exports.getRole = getRole;
module.exports.getUser = getUser;