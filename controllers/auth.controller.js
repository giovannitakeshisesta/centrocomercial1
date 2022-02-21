const mongoose = require('mongoose');
const User = require('../models/user.model');
//passport lo usamo para el log in 
const passport = require('passport'); 


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
              res.redirect('/login')
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


// LOGIN
module.exports.login = (req,res,next) => {
    res.render('auth/login')
}


// LOGIN - POST
module.exports.doLogin = (req, res, next) => {
  
    passport.authenticate('local-auth', (err, user, validations) => {
      if (err) {
        next(err)
      } else if(!user) {
        res.status(404).render('auth/login', { errorMessage: validations.error })
      } else {
        req.login(user, (loginError) => {
          if (loginError) {
            next(loginError)
          } else {
            res.redirect('/')
          }
        })
      }
    })(req, res, next)
  }
