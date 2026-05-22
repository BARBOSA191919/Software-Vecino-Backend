import { Router } from 'express'
import * as controller from './resena.controller'
import { verificarToken } from '../../middlewares/auth.middleware'

const router = Router()

// Rutas públicas
router.get('/negocio/:negocioId', controller.obtenerResenas)

// Rutas protegidas
router.post('/', verificarToken, controller.crearResena)

export default router
