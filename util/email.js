require('../config/config');

const send = (email) => {

    const nodemailer = require('nodemailer');

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'betterworldemail@gmail.com',
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const mailOptions = {
        from: 'betterworldemail@gmail.com',
        to: 'betterworldemail@gmail.com',
        subject: 'Better World user need be removed',
        text: `Remove user ${email}, password changed`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports.send = send;