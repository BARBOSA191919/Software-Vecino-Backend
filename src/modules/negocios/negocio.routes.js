const router = require('express').Router()
const controller = require('./negocio.controller')
const { verificarToken } = require('../../middlewares/auth.middleware')

// Rutas públicas
router.get('/', controller.obtenerNegocios)
router.get('/:id', controller.obtenerNegocioPorId)

// Rutas protegidas
router.get('/mis-negocios', verificarToken, controller.obtenerMisNegocios)
router.post('/', verificarToken, controller.crearNegocio)
router.put('/:id', verificarToken, controller.actualizarNegocio)
router.delete('/:id', verificarToken, controller.eliminarNegocio)

module.exports = router 