const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const EMAIL_PATTERN = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const PASSWORD_PATTERN = /^.{8,}$/i;
const SALT_ROUNDS = 10;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: 'name is required',
    minLength: [3, 'name needs at least 3 chars']
  },
  email: {
    type: String,
    required: 'email is required',
    match: [EMAIL_PATTERN, 'email is not valid'],
    unique: true
  },
  password: {
    type: String,
    required: 'password is required',
    match: [PASSWORD_PATTERN, 'password needs at least 8 chars'],
  },
  dueño: {
    type: String,
    default: "off"
  },
  provider: {
    type: String
  },
  providerId: {
    type: String
  },
  image:{
    type : String,
    default : 'https://res.cloudinary.com/dly7e46yt/image/upload/v1644841363/ironhack/multer-example/avatar.png'
  },
  // node mailer, when mail confirmed the active key switch to active
  active: {
    type: Boolean,
    default: true
  },// the token will be used only once in the authentication url
  activationToken: {
    type: String,
    default: () => {
      return Math.random().toString(36).substring(7) +
      Math.random().toString(36).substring(7) +
      Math.random().toString(36).substring(7) +
      Math.random().toString(36).substring(7)
    }
  } 
});

userSchema.virtual('likes', {
  ref: 'Like',
  localField: '_id',
  foreignField: 'user',
  justOne: false,
})

userSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'user',
  justOne: false,
})



userSchema.pre('save', function(next) {
  const user = this;

  if (user.isModified('password')) {
    bcrypt.hash(user.password, SALT_ROUNDS)
      .then((hash) => {
        user.password = hash
        next()
      })
      .catch(err => next(err))
  } else {
    next()
  }
})

// edit password
userSchema.pre('findOneAndUpdate', function (next) {
  console.log('entro en update', this._update.password)
  if (this._update.password) {
      bcrypt
      .hash(this._update.password, SALT_ROUNDS)
      .then((hash) => {
          this._update.password = hash
          next()
      })
  } else {
      next()
  }
})

userSchema.methods.checkPassword = function(password) {
  return bcrypt.compare(password, this.password)
}

const User = mongoose.model('User', userSchema);

module.exports = User;