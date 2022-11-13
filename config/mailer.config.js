const nodemailer = require('nodemailer');
const templActivation = require('./mailActivation');
const templChangeMail = require('./mailChange');

/**
 * create reusable transporter object using the default SMTP transport 
 */
 const transporter = nodemailer.createTransport({
  host: "smtp.mail.yahoo.com",
  port: 465,
  // secure: false, 
  auth: {
    user: process.env.NM_USER,
    pass: process.env.NM_PASSWORD
  }
})
// const transporter = nodemailer.createTransport({
//   service: "Gmail",
//   auth: {
//     user: process.env.NM_USER,
//     pass: process.env.NM_PASSWORD
//   }
// })


//-----------------//   ACTIVATE ACCOUNT  //----------------//
module.exports.sendActivationEmail = (email,token) => {
  transporter.sendMail({
    from: `Giovanni !!!!! <${process.env.NM_USER}>`,
    to: email,
    subject: "Activation Email",
    html: templActivation.generateEmail(token)
  })
}


//-----------------//    CHANGE EMAIL     //----------------//
module.exports.sendChangeEmail = (oldEmail, newEmail, token) => {
  transporter.sendMail({
    from: `Giovanni !!!!! <${process.env.NM_USER}>`,
    to: oldEmail,
    subject: "Change email, click on the button",
    html: templChangeMail.generateEmail(token,newEmail)
  })
}