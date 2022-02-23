const express = require('express')
const router = express.Router()
const misc = require('../controllers/misc.controller')
const auth = require('../controllers/auth.controller')
const myMw = require('../middlewares/myMw');
//multer
const upload = require('../config/storage.config');

// ------- AUTH ROUTES -------
router.get ('/register', auth.register)
router.post('/register', auth.doRegister)
router.get ('/login',    auth.login)
router.post('/login',    auth.doLogin)
router.get ('/logout',   auth.logout)

//upload.single('image'),
// ------- OWNER ROUTES -------
// Tienda 
router.get ('/tienda/create',     misc.tiendaCreate)
router.post('/tienda/create',     upload.single('image'), misc.tiendaDoCreate)
router.get ('/tienda/:id/edit',   myMw.isDueño, misc.tiendaEdit)
router.post('/tienda/:id/edit',   misc.tiendaDoEdit)
router.post('/tienda/:id/delete', misc.tiendaDelete)


// Productos 
router.get ('/producto/:tiendaId/create',   misc.productoCreate)
router.post('/producto/:tiendaId/create',   misc.productoDoCreate)
router.get ('/producto/:id/edit',           misc.productoEdit)
router.post('/producto/:id/edit',           misc.productoDoEdit)
router.post('/producto/:id/productoDelete', misc.productoDelete)



// ------- MISC ROUTES -------
router.get('/',             misc.home)
router.get('/tienda/:id',   misc.tienda)
router.get('/producto/:id', misc.producto)


router.get ('/prueba', (req, res, next) => {  res.render('prueba')})

module.exports = router 

// MULTER voy a configurar que llega una archivo en el campo image(name="image") del form y lo tienen que tratar
//router.post('/register',  upload.single('image'), authController.doRegister)