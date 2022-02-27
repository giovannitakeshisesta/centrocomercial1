const nodemailer = require('nodemailer');
const templActivation = require('./mailActivation');
const templChangeMail = require('./mailChange');

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.NM_USER,
    pass: process.env.NM_PASSWORD
  }
})

//-----------------//   ACTIVATE ACCOUNT  //----------------//
// `http://localhost:${process.env.PORT || 3000}`}/activate/${token}" 
module.exports.sendActivationEmail = (email,token) => {
  transporter.sendMail({
    from: `Giovanni !!!!! <${process.env.NM_USER}>`,
    to: email,
    subject: "Activation Email",
    html: templActivation.generateEmail(token)
  })
}

//-----------------//    CHANGE EMAIL     //----------------//
// /userAccount/editmail/${token}/${email}" 
module.exports.sendChangeEmail = (email, token) => {
  transporter.sendMail({
    from: `Giovanni !!!!! <${process.env.NM_USER}>`,
    to: email,
    subject: "Change email, click on the button",
    html: templChangeMail.generateEmail(token,email)
  })
}