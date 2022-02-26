const passport = require('passport');
const mongoose = require('mongoose');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const User = require('../models/user.model');

//-------------- passport -------------- 
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

//-------------- local strategy -------------- 
passport.use('local-strategy', new LocalStrategy(
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

//-------------- google strategy -------------- 
passport.use('google-auth', new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
  },
  (accessToken, refreshToken, profile, next) => {
    
    console.log("Google account details:", profile); // to see the structure of the data in received response:

    const googleID = profile.id;
    const name  = profile.displayName;
    const email = profile.emails && profile.emails[0].value || undefined
    //const image = profile.photos && profile.photos[0].value || undefined

    if (googleID && email) {
      User.findOne({ $or: [     // check if the user email or google Id exists in the db
        { email },
        { googleID }
      ]})
        .then(user => {  
          if (user) {           // if match : next
            next(null, user)
          } else {              // if not match : create one and next
            // Crear uno nuevo
            return User.create({
              name,
              email,
              password: mongoose.Types.ObjectId(),// invents a random pw
              googleID,
              //image
            })
              .then(userCreated => {
                next(null, userCreated) // return the data to the function => const doLogin = (req, res, next, provider = 'local-strategy') => {....

              })
          }
        })
        .catch(err => next(err))
    } else {
      next(null, false, { error: 'Error connecting with Google Auth' })
    }
  }
))