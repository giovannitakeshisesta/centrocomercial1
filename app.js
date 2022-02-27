//  ---------------------- Require ----------------------
require('dotenv').config();
require('./config/db.config')
require('./config/hbs.config')
require('./config/passport.config');

const sessionConfig = require('./config/session.config');
const router        = require('./config/routes.config')

const express       = require('express');
const createError   = require('http-errors');
const logger        = require('morgan');
const path          = require('path');
const passport      = require('passport');
const flash         = require('connect-flash');



//  ---------------------- Middlewares ----------------------
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(flash()); 


//  ---------------------- Passport + sessions + flash----------------------
app.use(sessionConfig);
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.flashMessage = req.flash('flashMessage'); 
  next();
})


//---------------------- Views setup ----------------------
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs') //the rendering engine for the views is: HBS

app.use('/', router)


//---------------------- Error Middlewares ----------------------
app.use((req, res, next) => {
  next(createError(404, 'Page not found'));
});

app.use((error, req, res, next) => {
  console.log(error)
  let status =  error.status || 500;

  res.status(status).render('error', {
    message: error.message,
    error: req.app.get('env') === 'development' ? error : {}
  })
})


//---------------------- Port settings ----------------------
const port = Number(process.env.PORT || 3000);

app.listen(port, () => {
  console.log(`App listen on port ${port}`)
});
