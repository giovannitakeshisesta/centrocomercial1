const mongoose = require('mongoose');
const User = require('../models/user.model');


// REGISTER
module.exports.register = (req,res,next) => {
    res.render('auth/register')
}


// REGISTER - POST
module.exports.doRegister = (req, res, next) => {
    const user = req.body;
  
    const renderWithErrors = (errors) => {
      res.render('auth/register', { errors, user })
    }
  
    User.findOne({ email: user.email })
      .then((userFound) => {
        if (userFound) {
          renderWithErrors({ email: 'Email already in use' })
        } else {
          return User.create(user)
            .then(() => {
              res.redirect('/register')
            })
        }
      })
      .catch(err => {
        if (err instanceof mongoose.Error.ValidationError) {
          console.log("errorerererer",err.errors)
          renderWithErrors(err.errors)
        } else {
          next(err)
        }
      })
  }