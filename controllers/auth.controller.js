const mongoose = require('mongoose');
const User = require('../models/user.model');
const passport = require('passport'); 
const mailer = require('../config/mailer.config');


//----------------------- // REGISTER  //  ----------------------- //
// REGISTER - GET
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
          .then((createdUser) => {
            mailer.sendActivationEmail(createdUser.email, createdUser.activationToken)
            req.flash('flashMessage', `Chek your inbox!`)
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


//----------------------- // ACTIVATE ACCOUNT //  ----------------------- //
module.exports.activate = (req, res, next) => {
  console.log(req.params.email)
  const activationToken = req.params.token;

  User.findOneAndUpdate(
    { activationToken, active: false },
    { active: true }
  )
    .then(() => {
      req.flash('flashMessage', 'You have activated your account. Now Log In!')
      res.redirect('/login')
    })
    .catch(err => next(err))
}


//----------------------- // LOGIN  //  ----------------------- //
// LOGIN GET
module.exports.login = (req,res,next) => {
  res.render('auth/login')
}

// LOGIN POST
const doLogin = (req, res, next,estrategia = 'local-strategy') => {
  passport.authenticate(estrategia, (err, user, validations) => {
    //console.log(user)
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



//----------------------- // LOGOUT  //  ----------------------- //
module.exports.logout = (req, res, next) => {
  req.flash('flashMessage', `Logged out!   See you soon!`)
  req.logout();
  res.redirect('/');
}

// -------------------------------------------------------------------------------