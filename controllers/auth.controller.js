const mongoose = require('mongoose');
const User = require('../models/user.model');
const passport = require('passport'); 

// -------------------------------------------------------------------------------
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
            req.flash('flashMessage', `Registration done! Now log in!`)
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

// -------------------------------------------------------------------------------
// LOGIN
module.exports.login = (req,res,next) => {
  res.render('auth/login')
}

// LOGIN POST
const doLogin = (req, res, next,estrategia = 'local-strategy') => {
  passport.authenticate(estrategia, (err, user, validations) => {
    console.log(user)
    if (err) {
      next(err)
    } else if(!user) {
      res.status(404).render('auth/login', { errorMessage: validations.error })
    } else {
      req.login(user, (loginError) => {
        if (loginError) {
          next(loginError)
        } else {
          req.flash('flashMessage', `Hi ${user.name}! You are logged in!`)
          res.redirect('/')
        }
      })
    }
  })(req, res, next)
}

// LOG IN LOCAL STRATEGY
module.exports.doLogin = (req, res, next) => {
  doLogin(req, res, next)
}

// LOG IN GOOGLE STRATEGY
module.exports.doLoginGoogle = (req, res, next) => {
  doLogin(req, res, next, 'google-auth')
}

// LOG IN GIT HUB STRATEGY
module.exports.doLoginGitHub = (req, res, next) => {
  doLogin(req, res, next, 'GitHubStrategy')
}

// -------------------------------------------------------------------------------
// LOGOUT 
module.exports.logout = (req, res, next) => {
  req.flash('flashMessage', `Logged out!   See you soon!`)
  req.logout();
  res.redirect('/');
}

// -------------------------------------------------------------------------------