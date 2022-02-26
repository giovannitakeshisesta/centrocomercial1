const express = require('express')
const router = express.Router()
const misc   = require('../controllers/misc.controller')
const auth   = require('../controllers/auth.controller')
const user   = require('../controllers/user.controller')
const myMw   = require('../middlewares/myMw');
const upload = require('../config/storage.config');
const passport = require('passport');

const GOOGLE_SCOPES = [
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email"
  ]

//----------------------------------------------------------------------
// ------- AUTH ROUTES -------
router.get ('/register', auth.register)
router.post('/register', auth.doRegister)
router.get ('/login',    auth.login)
router.post('/login',    auth.doLogin)
router.get ('/logout',   auth.logout)


// ------- LOGIN GOOGLE -------
router.get('/login/google', passport.authenticate('google-auth', { scope: GOOGLE_SCOPES }))
router.get('/auth/google/callback', auth.doLoginGoogle)



// ------- OWNER ROUTES -------
// Tienda 
router.get ('/tienda/create',           misc.tiendaCreate)
router.post('/tienda/create',           upload.single('image'), misc.tiendaDoCreate)
router.get ('/tienda/:tiendaId/edit',   myMw.isDueño, misc.tiendaEdit)
router.post('/tienda/:tiendaId/edit',   upload.single('image'), misc.tiendaDoEdit)
router.post('/tienda/:tiendaId/delete', misc.tiendaDelete)


// Productos 
router.get ('/producto/:tiendaId/create',             myMw.isDueño, misc.productoCreate)
router.post('/producto/:tiendaId/create',             misc.productoDoCreate)
router.get ('/producto/:productoId/edit/:tiendaId',   myMw.isDueño,misc.productoEdit)
router.post('/producto/:productoId/edit',             misc.productoDoEdit)
router.post('/producto/:productoId/delete/:tiendaId', misc.productoDelete)

// tiene sentido poner el middleware cuando la peticion es post?

// ------- MISC ROUTES -------
router.get('/',  misc.home)
router.get('/tienda/:tiendaId',     misc.tienda)
router.get('/producto/:productoId', misc.producto)
router.get ('/prueba', (req, res, next) => {  res.render('prueba')})


// ------- USER ROUTES -------
router.get ('/userAccount',                    user.renderUserAccount)
router.post('/userAccount/:userId/editName',   user.editUserName)
router.post('/userAccount/:userId/abreTienda', user.abretienda)
router.post('/userAccount/:userId/delete',     user.userDelete)

//router.post('/userAccount/:userId/editPw',     user.editPw)




module.exports = router 

