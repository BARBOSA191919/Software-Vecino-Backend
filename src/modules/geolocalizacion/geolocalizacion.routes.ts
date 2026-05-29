import { Router } from 'express'
import { obtenerNegociosCercanos, obtenerCategorias } from './geolocalizacion.controller'

const router = Router()

// Rutas publicas: el descubrimiento de negocios cercanos es para consumidores (EP-06).
// ⚠️ Rutas especificas SIEMPRE antes de rutas con parametros.
router.get('/categorias', obtenerCategorias)
router.get('/cercanos', obtenerNegociosCercanos)

export default router
