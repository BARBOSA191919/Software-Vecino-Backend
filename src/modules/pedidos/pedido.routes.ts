import { Router } from 'express'
import * as controller from './pedido.controller'
import { verificarToken } from '../../middlewares/auth.middleware'

const router = Router()

// Rutas para consumidores (HU-06)
router.post('/', verificarToken, controller.crearPedido)
router.get('/mis-pedidos', verificarToken, controller.obtenerMisPedidos)
router.get('/:id', verificarToken, controller.obtenerPedidoPorId)
router.get('/:id/historial', verificarToken, controller.obtenerHistorialPedido)

// Rutas para comerciantes (HU-09)
router.get('/negocio/:negocioId', verificarToken, controller.obtenerPedidosDeNegocio)
router.put('/:id/estado', verificarToken, controller.actualizarEstadoPedido)

export default router
