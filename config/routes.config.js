const express = require('express')
const router = express.Router()
const misc = require('../controllers/misc.controller')




// Owner routes
router.get ('/tienda/create', misc.tiendaCreate)
router.post('/tienda/create', misc.tiendaDoCreate)
router.get ('/tienda/:id/edit', misc.tiendaEdit)
router.post('/tienda/:id/edit', misc.tiendaDoEdit)
router.post('/tienda/:id/delete', misc.tiendaDelete)

/* Misc routes */
router.get('/', misc.home)
router.get('/tienda/:id', misc.tienda)

module.exports = router 