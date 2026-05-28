import { Router } from 'express'
import {
    crearNegocio,
    obtenerNegocios,
    obtenerMisNegocios,
    obtenerNegocioPorId,
    actualizarNegocio,
    eliminarNegocio
} from './negocio.controller'
import { verificarToken } from '../../middlewares/auth.middleware'

const router = Router()

// ⚠️ Rutas específicas SIEMPRE antes de rutas con parámetros
router.get('/mis-negocios', verificarToken, obtenerMisNegocios)

// Rutas públicas
router.get('/', obtenerNegocios)
router.get('/:id', obtenerNegocioPorId)

// Rutas protegidas
router.post('/', verificarToken, crearNegocio)
router.put('/:id', verificarToken, actualizarNegocio)
router.delete('/:id', verificarToken, eliminarNegocio)

export default router