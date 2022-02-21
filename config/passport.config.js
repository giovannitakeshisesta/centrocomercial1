const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user.model');

passport.serializeUser((user, next) => {
  next(null, user.id)
})

passport.deserializeUser((id, next) => {
  User.findById(id)
    .then(user => {
      next(null, user)
    })
    .catch(err => next(err))
})

passport.use('local-auth', new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password'
  },
  (email, password, next) => {
    User.findOne({ email })
      .then((user) => {
        if (!user) {
          next(null, false, { error: 'Email or password are incorrect, es la mail! shhhhh' })
        } else {
          return user.checkPassword(password)
            .then((match) => {
              if (!match) {
                next(null, false, { error: 'Email or password are incorrect es la password shhhh!' })
              } else {
                next(null, user)
              }
            })
        }
      })
      .catch(err => next(err))
  }
))

// in passport.config
// const passport = require('passport');
// const LocalStrategy = require('passport-local').Strategy;
// passport.serializeUser((user, next) => {})
// passport.deserializeUser((id, next) => {})
// passport.use()



// in app.js 
// app.use(passport.initialize());
// app.use(passport.session());


// "passport": "^0.5.2",         npm i passport
// "passport-local": "^1.0.0"    npm i passport-local