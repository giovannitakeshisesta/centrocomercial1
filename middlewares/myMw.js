module.exports.isAuthenticated = (req, res, next) => {
    if (req.user) {
      next();
    } else {
      res.redirect('/login')
    }
  }
  
  module.exports.isNotAuthenticated = (req, res, next) => {
    if (!req.user) {
      next();
    } else {
      res.redirect('/prueba')
    }
  }

  // ---------- is Dueño ----------
  module.exports.isDueño = (req, res, next) => {
    if (req.user && req.user.dueño) {
      next();
    } else {
      res.redirect('/login')
    }
  }

