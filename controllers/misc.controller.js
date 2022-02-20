const mongoose = require('mongoose');
const Tienda = require('../models/tienda.model');

// SHOW TIENDAS AT THE HOME PAGE
  module.exports.home = (req, res, next) => {
    Tienda.find()
      .sort({ createdAt: 'desc' })
      .limit(6)
      .then((tiendas) => res.render('misc/home', { tiendas }))
      .catch((error) => next(error));
  };


  //  SHOW TIENDA PAGE
module.exports.tienda = (req, res, next) => {
  Tienda.findById(req.params.id)
    .then((tienda) => {
      if (tienda) {
        res.render('misc/tienda', { tienda });
      } else {
        res.redirect('/');
      }
    })
    .catch(error => next(error));
};


//  TIENDA CREATE SHOW FORM
module.exports.tiendaCreate = (req, res, next) => {
  res.render('misc/tiendaCreate')
};



module.exports.tiendaDoCreate = (req, res, next) => {
  const tienda = new Tienda({
    name: req.body.name,
    image: req.body.image || undefined,
    description: req.body.description,
    categories: req.body.categories
  });

  tienda
    .save()
    .then(() => res.redirect('/'))
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(400).render('/tienda/create', {
          errors: error.errors,
          tienda
        });
      } else {
        next(error);
      }
    });
};



// module.exports.tiendaDoCreate = (req, res, next) => {
//   console.log("ADDING :",req.body)
//   console.log("image :",req.body.image)
 
//   Tienda.create(req.body)
//   .then(() =>  res.redirect('/'))
//   .catch((err) => console.log(`Error while creating a new tienda: ${err}`));
// };



// TIENDA EDIT  SHOW FORM
module.exports.tiendaEdit = (req, res, next) => {
  Tienda.findById(req.params.id)
    .then((tienda) => {
      res.render('misc/tiendaEdit', {tienda});
    })
    .catch(next)
};

// TIENDA EDIT POST FORM
module.exports.tiendaDoEdit = (req, res, next) => {
  let tiendaId = req.params.id;
  Tienda.findByIdAndUpdate(req.params.id, req.body, { runValidators: true, new: true })
    .then((tienda) => res.redirect(`/tienda/${tienda.id}`))
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(400).redirect(`/tienda/${tiendaId}/edit`);
      } else {
        next(error);
      }
    });
};

// DELETE TIENDA
module.exports.tiendaDelete = (req, res, next) => {
  Tienda.findByIdAndDelete(req.params.id)
  .then(()=> res.redirect('/'))
  .catch(next)
}


