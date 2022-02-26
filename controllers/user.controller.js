const mongoose = require('mongoose');
const User = require('../models/user.model');

//-------------------------------------------------------------------------------
// SHOW USER ACCOUNT PAGE
module.exports.renderUserAccount = (req, res, next) => {
    res.render('userAccount')
  }


//-------------------------------------------------------------------------------
// USER EDIT NAME
module.exports.editUserName = (req, res, next) => {
let newName = {name : req.body.name}
User.findByIdAndUpdate(req.params.userId,newName,{ runValidators: true})
    .then((user) => {
    res.redirect('/userAccount')
    })
    .catch((error) => {
    if (error instanceof mongoose.Error.ValidationError) {
        res.status(400).render('userAccount', { errors: error.errors });
    } else {
        next(error);
    }
    });
}
  
//-------------------------------------------------------------------------------
// USER EDIT PASSWORD  no hashea la pw....
// module.exports.editPw = (req, res, next) => {
// let newPassword = {password : req.body.password}
// console.log(newPassword)
// User.findByIdAndUpdate(req.params.userId,newPassword,{ runValidators: true})
//     .then((user) => {
//     res.redirect('/userAccount')
//     })
//     .catch((error) => {
//     if (error instanceof mongoose.Error.ValidationError) {
//         console.log(error)
//         res.status(400).render('userAccount', { errors: error.errors });
//     } else {
//         next(error);
//     }
//     });
// }


//-------------------------------------------------------------------------------
// USER EDIT EMAIL  






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
        console.log('Eliminar producto', user)
        res.redirect(`/`)
      })
      .catch(next)
  }
  