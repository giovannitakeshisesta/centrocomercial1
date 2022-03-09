const passport = require('passport');
const mongoose = require('mongoose');
const LocalStrategy  = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github').Strategy;

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
              } 
              else {
                if (user.active) {
                  next(null, user)
                } else {
                  next(null, false, { error: 'You have to activate your account' })
                }
              }
            })
        }
      })
      .catch(err => next(err))
  }
))


//-------------- social strategy -------------- 
const loginSocial = (profile, next) => {
  const providerId = profile.id;
    const name  = profile.displayName;
    const email = profile.emails && profile.emails[0].value || undefined
    const provider = profile.provider
    console.log(`${provider} account details:`, profile.photos[0].value); // to see the structure of the data in received response:

    if (providerId && email) {
      User.findOne({ $or: [     // check if the user email or google Id exists in the db
        { email },
        { providerId }
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
              providerId,
              provider,
              image : profile.photos[0].value
            })
              .then(userCreated => {
                next(null, userCreated) // return the data to the function => const doLogin = (req, res, next, provider = 'local-strategy') => {....
              })
          }
        })
        .catch(err => next(err))
    } else {
      next(null, false, { error: `Error connecting with ${provider} strategy` })
    }
}


//-------------- google strategy -------------- 
passport.use('google-auth', new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
  },
  (accessToken, refreshToken, profile, next)=> {
    loginSocial(profile,next)
  }
))


//-------------- git hub strategy -------------- 
passport.use('GitHubStrategy', new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_REDIRECT_URI || "/auth/github/callback"
  },
  (accessToken, refreshToken, profile, next)=> {
    loginSocial(profile,next)
  }
))