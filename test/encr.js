require('../config/config');

const Blowfish = require('blowfish-security-lib');
const bf = new Blowfish(process.env.SECRET_KEY);

console.log(bf.encrypt(process.argv[2]));