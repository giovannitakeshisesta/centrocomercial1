const mongoose = require('mongoose');
const Tienda = require('../models/tienda.model');


module.exports.isDueño = (req, res, next) => {
  Tienda.findOne({ownerId:req.user.id})
  .then((tienda) => {
      // console.log("id tienda es",req.params.id)
      // console.log("ID de quien hace la peticion es", req.user.id)
      // console.log("el id de la tienda del usuario ",tienda.id)
      if (tienda.id  === req.params.id){
        next();
      } else {
        res.redirect('/')
      }
  })
  .catch(error => next(error));
}


