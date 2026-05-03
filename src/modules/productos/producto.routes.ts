import { Router } from 'express'
import * as controller from './producto.controller'
import { verificarToken } from '../../middlewares/auth.middleware'

const router = Router()

router.get('/', controller.obtenerProductos)
router.get('/mis-productos', verificarToken, controller.obtenerMisProductos)
router.post('/', verificarToken, controller.crearProducto)

export default router
