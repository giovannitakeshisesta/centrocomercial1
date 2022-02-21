const express = require('express')
const router = express.Router()
const misc = require('../controllers/misc.controller')
const auth = require('../controllers/auth.controller')





// OWNER ROUTES
// Tienda 
router.get ('/tienda/create', misc.tiendaCreate)
router.post('/tienda/create', misc.tiendaDoCreate)
router.get ('/tienda/:id/edit', misc.tiendaEdit)
router.post('/tienda/:id/edit', misc.tiendaDoEdit)
router.post('/tienda/:id/delete', misc.tiendaDelete)

// Productos 
router.get('/producto/:tiendaId/create', misc.productoCreate)
router.post('/producto/:tiendaId/create', misc.productoDoCreate)
router.get('/producto/:id', misc.producto)



/* MISC ROUTES  */
router.get('/', misc.home)
router.get('/tienda/:id', misc.tienda)


// AUTH ROUTES
router.get ('/register', auth.register)
router.post ('/register', auth.doRegister)


module.exports = router 