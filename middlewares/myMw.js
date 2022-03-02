const mongoose = require('mongoose');
const Tienda = require('../models/tienda.model');

// Check if the User visiting the tienda is the owner of the tienda
module.exports.isDueño = (req, res, next) => {
  if (req.user && req.user.dueño === "on"){
    Tienda.findOne({ownerId:req.user.id})
    .then((tienda) => {
      // console.log("ID de quien hace la peticion es", req.user.id)
      // console.log("id tienda es",req.params.tiendaId)
      // console.log("el id de la tienda del usuario ",tienda.id)
        if (tienda.id  === req.params.tiendaId){
          next();
        } else {
          res.render('misc/stop')
        }
    })
    .catch(error => { //si user es dueño per no ha abierto tiendas
      console.log(error)
      res.render('misc/stop')
    });
  } 
  else {
    res.render('misc/stop')
  }
}

module.exports.isNotAuth = (req, res, next) => {
  if (!req.user) {
    next();
  } 
}

module.exports.isAuth = (req, res, next) => {
  if (req.user ) {
    console.log("IS AUTH the user is :",req.user.name)
    next();
  } else {
    console.log("mw no user logged")
    res.redirect('/login')
  }
}


module.exports.isTheUser = (req, res, next) => {
  console.log("IS THE USER")
  if (req.user && req.user.id === req.params.userId ) {
    console.log("IS THE USER :",req.user.name)
    console.log("IS THE USER :",req.params.userId )
    next();
  } else {
    console.log("mw no user logged")
    res.redirect('/login')
  }
}
