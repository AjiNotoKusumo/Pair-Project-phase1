const nodemailer = require('nodemailer');

const accountEmail = 'indy040103@gmail.com'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: accountEmail,
        pass: 'brai bxtm zezt lsxl'
    },
    tls: {
        rejectUnauthorized: false
    }
});

module.exports = {accountEmail, transporter}