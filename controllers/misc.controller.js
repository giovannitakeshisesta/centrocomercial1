const mongoose = require('mongoose');
const Tienda = require('../models/tienda.model');
const Producto = require('../models/producto.model');
const User = require('../models/user.model');
const Like = require('../models/like.model');
const Comment = require('../models/comment.model');




// -------------------------------------------------------------------------------
//  SHOW TIENDAS AT THE HOME PAGE 

module.exports.home = (req, res, next) => {
  Tienda.find()
    .sort({ createdAt: 'desc' })
    .then((tiendas) => res.render('misc/home', { tiendas }))
    .catch((error) => next(error));
};


//  SHOW TIENDA PAGE

module.exports.tienda = (req, res, next) => {
  Tienda.findById(req.params.tiendaId)
  .then((tienda) => {
    if (tienda) {
      Producto.find({tienda:req.params.tiendaId})
      .then((pro)=> {
        if (req.user){
          Like.find({ user: req.user.id})
          .then((userlikes)=> {
            return Like.find()
            .then((allLikes)=> res.render('misc/tienda', {tienda,pro,userlikes,allLikes}))              
          }) 
        }
        else {res.render('misc/tienda', {tienda,pro})}       
      })
      .catch(next)
    } else { res.redirect('/');}
  })
  .catch(error => next(error));
};

// -------------------------------------------------------------------------------
//  TIENDA CREATE - GET FORM 

module.exports.tiendaCreate = (req, res, next) => {
  res.render('misc/tiendaCreate')
};


//  TIENDA CREATE - POST FORM
module.exports.tiendaDoCreate = (req, res, next) => {
  //console.log("body", req.body)
  //console.log("muulter", req.file)
  req.file? req.body.image = req.file.path : req.body.image = undefined;
  
  const tienda = new Tienda({
    ownerId: req.user.id,
    name: req.body.name,
    description: req.body.description,
    categories: req.body.categories,
    officialWeb: req.body.officialWeb,
    logo: req.body.logo     || undefined,
    image1: req.body.image1 || undefined,
    image2: req.body.image2 || undefined,
    image : req.body.image 
  });

  tienda
    .save()
    .then(() => res.redirect('/'))
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        console.log(error)
        res.status(400).render('misc/tiendaCreate', {
          errors: error.errors,
          tienda
        });
      } else {
        next(error);
      }
    });
};

// -------------------------------------------------------------------------------
// TIENDA EDIT - GET FORM

module.exports.tiendaEdit = (req, res, next) => {
  Tienda.findById(req.params.tiendaId)
    .then((tienda) => {
      res.render('misc/tiendaEdit', {tienda});
    })
    .catch(next)
};

module.exports.tiendaDesing = (req, res, next) => {
  res.render('misc/tiendaDesing');
}


// TIENDA EDIT - POST FORM

module.exports.tiendaDoEdit = (req, res, next) => {
  let tiendaId = req.params.tiendaId;

  Tienda.findById(tiendaId)
    .then((tienda) => {
      let oldImage = tienda.image
      //console.log(oldImage,req.file)
      if (req.file){
        req.body.image  = req.file.path
      } else {
        req.body.image  = oldImage
      }
      return Tienda.findByIdAndUpdate(tiendaId, req.body, { runValidators: true, new: true })
      .then((tienda) => res.redirect(`/tienda/${tienda.id}`))

    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(400).redirect(`/tienda/${tiendaId}/edit`);
      } else {
        next(error);
      }
    });
};

// -------------------------------------------------------------------------------
// DELETE TIENDA and products,like,comments

module.exports.tiendaDelete = (req, res, next) => {
  let tiendaId = req.params.tiendaId
  Tienda.findByIdAndDelete(tiendaId)
  .then(()=> {
    return User.findByIdAndUpdate(req.user, {dueño : "off"})
  })
  .then(()=> {
    return Producto.find({tienda :tiendaId})
  })
  .then((prod)=> {
    return prod.forEach(el => deleteProductLikeComm(el.id))
  })
  .then(()=> res.redirect('/'))
  .catch(next)
}


// -------------------------------------------------------------------------------
//  PRODUCTO CREATE - GET FORM 

module.exports.productoCreate = (req, res, next) => {
  let tiendaId = req.params.tiendaId
  res.render('misc/productoCreate', {tiendaId})
};


//  PRODUCTO CREATE - POST FORM
module.exports.productoDoCreate = (req, res, next) => {
  let tiendaId = req.params.tiendaId
  console.log(tiendaId, req.body)

  const producto = new Producto({
    ownerId: req.user.id,
    tienda : tiendaId,
    name: req.body.name,
    description: req.body.description,
    precio: req.body.precio,
    image1: req.body.image1 || undefined,
    image2: req.body.image2|| undefined
  });

  producto
    .save()
    .then(() => {
      res.redirect(`/tienda/${tiendaId}`)
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        console.log(error)
        res.status(400).render(`misc/productoCreate`, {
          errors: error.errors,
          producto,
          tiendaId
        });
      } else {
        next(error);
      }
    });
}


// -------------------------------------------------------------------------------
//  PRODUCTO SHOW DETAILS

module.exports.producto = (req, res, next) => {
  let productoId = req.params.productoId

  Comment.find({producto:`${productoId}`})
    .then((result)=> {
      var sumRatings = result.reduce((acc, curr) => acc + curr.rating, 0);
      const averageRating = sumRatings / result.length
      
      return  Producto.findById(productoId)
      .populate({
        path: 'comments',
        populate:{
          path:'user',
        }
      })
      .then((prod)=> {
          return res.render('misc/producto', {prod,averageRating})
        })
    })    
    .catch(next)
}



// -------------------------------------------------------------------------------
// PRODUCTO EDIT . GET FORM

module.exports.productoEdit = (req, res, next) => {
  let tiendaId = req.params.tiendaId
  Producto.findById(req.params.productoId)
    .then( producto => {
      res.render('misc/productoEdit', { producto ,tiendaId})
    })
    .catch(next)
}

// PRODUCTO EDIT . POST FORM
module.exports.productoDoEdit = (req, res, next) => {
  let productoId = req.params.productoId

  Producto.findByIdAndUpdate(productoId, req.body, { runValidators: true, new: true } )
    .then(producto => {
      res.redirect(`/producto/${producto.id}`)
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(400).redirect(`/producto/${productoId}/edit`);
      } else {
        next(error);
      }
    });
}

// -------------------------------------------------------------------------------
const deleteProductLikeComm = (productoId)=>{
  Producto.findByIdAndDelete(productoId)
  .then(() => {return Like.deleteMany({producto: productoId })})  
  .then(() => {return Comment.deleteMany({producto: productoId })}) 
  .catch(err => next(err))
}


// PRODUCTO DELETE,like,comments

module.exports.productoDelete = (req, res, next) => {
 
    deleteProductLikeComm(req.params.productoId)
    res.redirect(`/tienda/${req.params.tiendaId}`)
}

// -------------------------------------------------------------------------------
