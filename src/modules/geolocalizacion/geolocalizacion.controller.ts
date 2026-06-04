import { Request, Response } from 'express'
import * as geoService from './geolocalizacion.service'

/**
 * Convierte un query param (posiblemente array o undefined) a numero.
 * Devuelve undefined si el valor no esta presente.
 */
const aNumeroOpcional = (valor: unknown): number | undefined => {
  if (valor === undefined || valor === null || valor === '') return undefined
  const crudo = Array.isArray(valor) ? valor[0] : valor
  return Number(crudo)
}

const aTextoOpcional = (valor: unknown): string | undefined => {
  if (valor === undefined || valor === null || valor === '') return undefined
  return Array.isArray(valor) ? String(valor[0]) : String(valor)
}

/**
 * GET /api/geolocalizacion/cercanos
 * Devuelve negocios cercanos a la ubicacion del consumidor como marcadores
 * para el mapa, filtrados por categoria, distancia y calificacion.
 */
export const obtenerNegociosCercanos = async (req: Request, res: Response): Promise<void> => {
  try {
    const latitud = aNumeroOpcional(req.query.lat ?? req.query.latitud)
    const longitud = aNumeroOpcional(req.query.lng ?? req.query.longitud)

    if (latitud === undefined || longitud === undefined) {
      res.status(400).json({
        success: false,
        mensaje: 'Los parametros lat y lng son obligatorios'
      })
      return
    }

    const marcadores = await geoService.buscarNegociosCercanos({
      latitud,
      longitud,
      radioKm: aNumeroOpcional(req.query.radio ?? req.query.radioKm),
      categoria: aTextoOpcional(req.query.categoria),
      ciudad: aTextoOpcional(req.query.ciudad),
      calificacionMin: aNumeroOpcional(req.query.calificacion_min ?? req.query.calificacionMin)
    })

    res.status(200).json({
      success: true,
      total: marcadores.length,
      data: marcadores
    })
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error desconocido'
    res.status(400).json({
      success: false,
      mensaje
    })
  }
}

/**
 * GET /api/geolocalizacion/categorias
 * Lista las categorias de negocios geolocalizados para el filtro del mapa.
 */
export const obtenerCategorias = async (_req: Request, res: Response): Promise<void> => {
  try {
    const categorias = await geoService.obtenerCategorias()
    res.status(200).json({
      success: true,
      total: categorias.length,
      data: categorias
    })
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error desconocido'
    res.status(500).json({
      success: false,
      mensaje
    })
  }
}
