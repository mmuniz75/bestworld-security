clearrequire('../config/config');

const Crypto = require('cryptr');

const cryptr = new Crypto(process.env.SECRET_KEY);
const encode = cryptr.encrypt(process.argv[2]) ;
console.log(encode);


