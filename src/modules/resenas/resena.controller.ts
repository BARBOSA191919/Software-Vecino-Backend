import { Request, Response } from 'express'
import * as ResenaService from './resena.service'

export const crearResena = async (req: Request, res: Response) => {
  try {
    const usuarioId = req.usuario?.id
    if (!usuarioId) {
      return res.status(401).json({ success: false, error: 'No autorizado' })
    }

    const { negocioId, calificacion, comentario } = req.body

    if (!negocioId || calificacion === undefined) {
      return res.status(400).json({ success: false, error: 'Faltan datos requeridos' })
    }

    if (calificacion < 1 || calificacion > 5) {
      return res.status(422).json({ success: false, error: 'La calificación debe estar entre 1 y 5' })
    }

    const resena = await ResenaService.crearResena(usuarioId, negocioId, calificacion, comentario)
    res.status(201).json({ success: true, data: resena })
  } catch (error: any) {
    if (error.message.includes('Solo puedes reseñar un negocio si has realizado al menos un pedido')) {
      return res.status(403).json({ success: false, error: error.message })
    }
    if (error.code === '23505') { // Unique violation in postgres
      return res.status(409).json({ success: false, error: 'Ya has reseñado este negocio' })
    }
    if (error.code === '23514') { // Check constraint violation
      return res.status(422).json({ success: false, error: 'La calificación no cumple con los requisitos' })
    }
    res.status(500).json({ success: false, error: 'Error al crear la reseña', detail: error.message })
  }
}

export const obtenerResenas = async (req: Request, res: Response) => {
  try {
    const { negocioId } = req.params
    const resenas = await ResenaService.obtenerResenas(Array.isArray(negocioId) ? negocioId[0] : negocioId)
    res.status(200).json({ success: true, data: resenas })
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Error al obtener las reseñas', detail: error.message })
  }
}
