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
    .catch(error => next(error));
  } 
  else {
    res.render('misc/stop')
  }
}
