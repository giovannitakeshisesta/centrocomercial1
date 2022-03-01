const mongoose = require('mongoose');
const User = require('../models/user.model');
const mailer = require('../config/mailer.config');


//-------------------------------------------------------------------------------
// SHOW USER ACCOUNT PAGE
module.exports.rendereditUser = (req, res, next) => {
        res.render('editUser')  
}


//-------------------------------------------------------------------------------
// USER EDIT NAME
module.exports.editUserName = (req, res, next) => {
let newName = {name : req.body.name}
User.findByIdAndUpdate(req.params.userId,newName,{ runValidators: true})
    .then((user) => {
    res.redirect('/editUser')
    })
    .catch((error) => {
    if (error instanceof mongoose.Error.ValidationError) {
        res.status(400).render('editUser', { errors: error.errors });
    } else {
        next(error);
    }
    });
}
  

//-------------------------------------------------------------------------------
// USER EDIT IMAGE
module.exports.editUserImage = (req, res, next) => {
    let newImage = {image : req.file.path}
    console.log(newImage)
    User.findByIdAndUpdate(req.params.userId,newImage,{ runValidators: true})
        .then((user) => {
        res.redirect('/editUser')
        })
        .catch((error) => {
        if (error instanceof mongoose.Error.ValidationError) {
            res.status(400).render('editUser', { errors: error.errors });
        } else {
            next(error);
        }
        });
}


//-------------------------------------------------------------------------------
// USER EDIT PASSWORD  no hashea la pw....

module.exports.editPw = (req, res, next) => {
    let userId = req.params.userId
    let oldPassword = req.body.oldPassword
    let password = req.body.password
    console.log(oldPassword ,password, userId)

    const renderWithErrors = (errors) => {
        console.log(errors)
        res.render('editUser', {errors})
    }

    User.findById(userId)
    .then((user) => {
        return user.checkPassword(oldPassword)
        .then((match) => {
            if (!match) {
                renderWithErrors({ password: 'Old password is incorrect' })
            } 
            else {
                if (password.length<8){
                    renderWithErrors({ password: 'must cntsin 8 char' })
                }else {
                    User.findByIdAndUpdate(userId, {password:password}, { runValidators: true, new: true})
                    .then((user)=> {
                        res.redirect('/editUser')
                    })
                    .catch((error) => {
                        if (error instanceof mongoose.Error.ValidationError) {
                            res.status(400).render('editUser', { errors: error.errors });
                        } else {
                            next(error);
                        }
                    });
                }
                
            }
        })
    })
    .catch(err => next(err))
}


//-------------------------------------------------------------------------------
// USER EDIT EMAIL  send email
module.exports.sendEmail = (req, res, next) => {
    //console.log(req.body.email, req.params.userId)
    User.findById(req.params.userId)
    .then((user)=> {
        //console.log(user.activationToken)
        mailer.sendChangeEmail(req.body.email, user.activationToken)
        req.flash('flashMessage', `Chek your inbox! Logged out!   See you soon!`)
        req.logout();
        res.redirect('/');
    })
}


// USER EDIT MAIL from email to  login
module.exports.editEmail = (req, res, next) => {
    //console.log(req.params.email, req.params.token)
    const activationToken = req.params.token;
  
    User.findOneAndUpdate(
      { activationToken },
      { email : req.params.email }
    )
      .then(() => {
        req.flash('flashMessage', 'Email changed. Now Log In!')
        res.redirect('/login')
      })
      .catch(err => next(err))
  }
  

//-------------------------------------------------------------------------------
// USER ABRE TIENDA
module.exports.abretienda = (req, res, next) => {
let dueño = {dueño : "on"}
User.findByIdAndUpdate(req.params.userId,dueño)
    .then((user) => {
    res.redirect('/tienda/create')
    })
    .catch(next)
}

//-------------------------------------------------------------------------------
// USER DELETE
module.exports.userDelete = (req, res, next) => {
    User.findByIdAndDelete(req.params.userId)
      .then((user) => {
        console.log('Eliminar User', user)
        res.redirect(`/`)
      })
      .catch(next)
  }
  