import { Router } from 'express'
import * as controller from './negocio.controller'
import { verificarToken } from '../../middlewares/auth.middleware'

const router = Router()

// Rutas públicas
router.get('/', controller.obtenerNegocios)
router.get('/:id', controller.obtenerNegocioPorId)

// Rutas protegidas
router.get('/mis-negocios', verificarToken, controller.obtenerMisNegocios)
router.post('/', verificarToken, controller.crearNegocio)
router.put('/:id', verificarToken, controller.actualizarNegocio)
router.delete('/:id', verificarToken, controller.eliminarNegocio)

export default router 