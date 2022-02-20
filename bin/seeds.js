require('dotenv').config();

const mongoose = require('mongoose')
const tiendas = require('../data/tiendas.json')
const Tienda = require('../models/tienda.model')
const productos = require('../data/productos.json')
const Producto = require('../models/producto.model')
require('../config/db.config');

mongoose.connection.once('open', () => {
  console.info(`*** Connected to the database ${mongoose.connection.db.databaseName} ***`);

  mongoose.connection.db
    .dropDatabase()
      .then(() => `O.o! ${mongoose.connection.db.databaseName} dropped!`)    
      .then(() => {
        tiendas.forEach(tIeNdA => {
          new Tienda({
            ...tIeNdA
          
          }).save()
            .then(shop => console.log(`${shop.name} has been created!`))
            .catch(err =>  console.error(err))
        })

        productos.forEach(pRoD => {
          new Producto({
            ...pRoD
          
          }).save()
            .then(prod => console.log(`${prod.name} has been created!`))
            .catch(err =>  console.error(err))
        })
      })
      .catch(err => console.error('mongoose', err))
})


