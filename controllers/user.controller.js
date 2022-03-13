const mongoose = require('mongoose');
const User = require('../models/user.model');
const mailer = require('../config/mailer.config');
const Like = require('../models/like.model')
const Comment = require('../models/comment.model');
const Producto = require('../models/producto.model');
const Tienda = require('../models/tienda.model');


//-------------------------------------------------------------------------------
// SHOW USER ACCOUNT PAGE
module.exports.renderEditUser = (req, res, next) => {
    // la forma de siempre
    // Like.find({ user: req.user.id })
    // .then((likes) => {
    //   console.log(likes)
    //   res.render("user/editUser", { likes })
    // })
    // .catch(next)

    // con populate
    // User.findById(req.user.id)
    // .populate('likes')
    // .then((user)=> res.render("user/editUser",{user}))
    // .catch(next)

    // con multiple populate
    User.findById(req.user.id)
    .populate({
        path: 'likes',
        populate:{
            path:'producto',
            populate:{
                path:'tienda'
            }
        }
    })
    .then((user)=> res.render("user/editUser",{user}))
    .catch(next)
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
        res.status(400).render('user/editUser', { errors: error.errors });
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
            res.status(400).render('user/editUser', { errors: error.errors });
        } else {
            next(error);
        }
        });
}


//-------------------------------------------------------------------------------
// USER EDIT PASSWORD 

module.exports.editPw = (req, res, next) => {
    let userId = req.params.userId
    let oldPassword = req.body.oldPassword
    let password = req.body.password
    console.log(oldPassword ,password, userId)

    const renderWithErrors = (errors) => {
        console.log(errors)
        res.render('user/editUser', {errors})
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
                    renderWithErrors({ password: 'must contain 8 char' })
                }else {
                    User.findByIdAndUpdate(userId, {password:password}, { runValidators: true, new: true})
                    .then((user)=> { 
                        req.flash('flashMessage', `Password updated succesfully`)
                        res.redirect('/editUser')
                    })
                    .catch((error) => {
                        if (error instanceof mongoose.Error.ValidationError) {
                            res.status(400).render('user/editUser', { errors: error.errors });
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
    let oldEmail = req.params.oldEmail
    let newEmail = req.body.email
    User.findById(req.params.userId)
    .then((user)=> {
        //console.log("Chek your inbox! Logged out!",user.activationToken)
        mailer.sendChangeEmail(oldEmail, newEmail, user.activationToken)
        req.flash('flashMessage', `Chek your inbox! Logged out!   See you soon!`)
        req.logout();
        res.redirect('/');
    })
}


// USER EDIT MAIL from email to  login

module.exports.editEmail = (req, res, next) => {
    //console.log(req.params.newEmail, req.params.token)
    const activationToken = req.params.token;
    const newEmail = req.params.newEmail
  
    User.findOneAndUpdate(
      { activationToken },
      { email : newEmail }
    )
      .then(() => {
        req.flash('flashMessage', 'Email changed. Now Log In!')
        res.redirect('/login')
      })
      .catch(err => next(err))
  }
  


//-------------------------------------------------------------------------------
// USER DELETE

module.exports.userDelete = (req, res, next) => {
    let userId = req.params.userId
    User.findByIdAndDelete(userId)
    .then(() => {return Tienda.deleteMany({ownerId: userId })}) 
    .then(() => {return Producto.deleteMany({ownerId: userId })}) 
    .then(() => {return Like.deleteMany({user: userId })}) 
    .then(() => {return Comment.deleteMany({user: userId })}) 
    .then((user) => { res.redirect(`/`)})
    .catch(next)
}
  
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
// USER LIKE

module.exports.doLike = (req, res, next) => {
  const tiendaId = req.params.tiendaId
  const prodId = req.params.productId
  const userId = req.user.id

  Like.findOneAndDelete({ producto: prodId, user: userId})
    .then(like => {
      if (like) {
        res.status(200).send({ success : 'Like remove from DDBB'})
      } else {
        return Like.create({ producto: prodId, user: userId })
          .then(() => {res.status(201).send({ success : 'Like added to DDBB' }) })
      }
    })
    .catch(next)
}


//-------------------------------------------------------------------------------
// USER COMMENT

module.exports.comment = (req, res, next) => {
    const user = req.params.userId
    const producto = req.params.productId
    const text = req.body.comment
    const rating = req.body.rating

    const comment = new Comment({
        user: user,
        producto: producto,
        comment: text,
        rating: rating
    });
    
    comment.save()
    .then((comment) => {res.redirect(`/producto/${producto}`)})
    .catch(next)
}
  

//-------------------------------------------------------------------------------
// USER EDIT COMMENT
module.exports.commentEdit = (req, res, next) => {
    let productId  = req.params.productId
    let newComment = req.body.comment
    let newRating  = req.body.rating
    let commentId  = req.params.commentId
    //console.log(newComment,commentId,newRating)

    Comment.findByIdAndUpdate(
        {"_id": commentId}, 
        {"$set":{"comment": newComment,"rating": newRating}}, 
        {runValidators: true})
        .then((user) => { res.redirect(`/producto/${productId}`) })
        .catch(next)
}


//-------------------------------------------------------------------------------
// USER DELETE COMMENT
module.exports.commentDelete = (req, res, next) => {
    let productId = req.params.productId
    let commentId = req.params.commentId
    Comment.findByIdAndDelete(commentId)
        .then((user) => { res.redirect(`/producto/${productId}`) })
        .catch(next)
}


//-------------------------------------------------------------------------------