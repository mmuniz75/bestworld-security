const axios = require('axios');

const getRole = async (email,token) => {
      return await getUserData(email,token,true);
}

const getDetail = async (email,token) => {
    return await getUserData(email,token,false);
}    

const getUserData = async (email,token,justRole) => {

    const resonseUser = await axios.get(`${process.env.FIREBASE_SERVER}/usuarios.json?orderBy="email"&equalTo="${email}"&auth=${token}`);

    let role = null;
    let creatorId = null;
    let id = null;

    Object.keys(resonseUser.data).map(key => {
      const userData = resonseUser.data[key];
      role = userData.role;
      creatorId = userData.creatorId;
      id = key;
    });

    if(justRole)
        return role;
    else
        return {role,creatorId,id};    
}

const getUser = async (token) => {
    
    const response = await axios.post(`${process.env.GOOGLE_API_URL}/getAccountInfo?key=${process.env.FIREBASE_KEY}`,{"idToken":token});

    const user = {
        email: response.data.users[0].email,
        id: response.data.users[0].localId,
        role: "default" ,
        creatorId: null
    };
    
    const detail = await getDetail(user.email,token);
    user.role = detail.role;
    user.creatorId = detail.creatorId;

    return user;
} 

const getToken = async (email,password) => {

    const authData = {
      email: email,
      password: password,
      returnSecureToken: true
    };

    let user = {};
    
    const responseAuth = await axios.post(`${process.env.GOOGLE_API_URL}/verifyPassword?key=${process.env.FIREBASE_KEY}`,authData);

    user = {
        token: responseAuth.data.idToken,
        id:responseAuth.data.localId,
        expiresIn: responseAuth.data.expiresIn,
    };

    return user;
};

module.exports.getRole = getRole;
module.exports.getUser = getUser;
module.exports.getToken = getToken;
module.exports.getDetail = getDetail;