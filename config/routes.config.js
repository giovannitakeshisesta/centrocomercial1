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
router.get ('/register', myMw.isNotAuth, auth.register)
router.post('/register', myMw.isNotAuth, auth.doRegister)
router.get ('/login',    myMw.isNotAuth, auth.login)
router.post('/login',    myMw.isNotAuth, auth.doLogin)
router.get ('/logout',   myMw.isAuth, auth.logout)
//router.get ('/activate/:token', auth.activate)


// ------- LOGIN GOOGLE -------
router.get('/login/google',         myMw.isNotAuth, passport.authenticate('google-auth', { scope: GOOGLE_SCOPES }))
router.get('/auth/google/callback', myMw.isNotAuth, auth.doLoginGoogle)

// ------- LOGIN GIT HUB -------
router.get('/login/gitHub',          myMw.isNotAuth, passport.authenticate('GitHubStrategy'))
router.get('/auth/github/callback' , myMw.isNotAuth, auth.doLoginGitHub)


//----------------------------------------------------------------------
// ------- USER ROUTES -------
router.get ('/editUser',                        myMw.isAuth,    user.renderEditUser)
router.post('/editUser/:userId/editName',       myMw.isTheUser, user.editUserName)
router.post('/editUser/:userId/editUserImage',  myMw.isTheUser, upload.single('image'), user.editUserImage)
router.post('/editUser/:userId/editEmail',      myMw.isTheUser, user.sendEmail)
router.get ('/editUser/editmail/:token/:email', myMw.isNotAuth, user.editEmail)
router.post('/editUser/:userId/editPw',         myMw.isTheUser, user.editPw)
router.post('/editUser/:userId/abreTienda',     myMw.isTheUser, user.abretienda)
router.post('/editUser/:userId/delete',         myMw.isTheUser, user.userDelete)

//----------------------------------------------------------------------
// ------- LIKES ROUTES -------
router.post('/like/:productId',  user.doLike)
router.post('/comment/:productId/:userId',  user.comment)


//----------------------------------------------------------------------
// ------- OWNER ROUTES -------
// Tienda 
router.get ('/tienda/create',           myMw.isAuth , misc.tiendaCreate)
router.post('/tienda/create',           myMw.isAuth , upload.single('image'), misc.tiendaDoCreate)
router.get ('/tienda/:tiendaId/edit',   myMw.isDueño, misc.tiendaEdit)
router.post('/tienda/:tiendaId/edit',   myMw.isDueño, upload.single('image'), misc.tiendaDoEdit)
router.post('/tienda/:tiendaId/delete', myMw.isDueño, misc.tiendaDelete)


// Productos 
router.get ('/producto/:tiendaId/create',             myMw.isDueño, misc.productoCreate)
router.post('/producto/:tiendaId/create',             myMw.isDueño, misc.productoDoCreate)
router.get ('/producto/:productoId/edit/:tiendaId',   myMw.isDueño, misc.productoEdit)
router.post('/producto/:productoId/edit/:tiendaId',   myMw.isDueño, misc.productoDoEdit)
router.post('/producto/:productoId/delete/:tiendaId', myMw.isDueño, misc.productoDelete)


//----------------------------------------------------------------------
// ------- MISC ROUTES -------
router.get('/',  misc.home)
router.get('/tienda/:tiendaId',     misc.tienda)
router.get('/producto/:productoId', misc.producto)
router.get ('/prueba', (req, res, next) => {  res.render('prueba')})





module.exports = router 

