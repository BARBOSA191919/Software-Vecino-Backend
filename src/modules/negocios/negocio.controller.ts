import { Request, Response } from 'express'
import * as negocioService from './negocio.service'

export const crearNegocio = async (req: Request, res: Response): Promise<void> => {
  try {
    const usuarioId = req.usuario?.id
    if (!usuarioId) {
      res.status(401).json({
        success: false,
        mensaje: 'Usuario no autenticado'
      })
      return
    }

    const negocio = await negocioService.crearNegocio(usuarioId, req.body)
    res.status(201).json({
      success: true,
      mensaje: 'Negocio creado exitosamente',
      data: negocio
    })
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error desconocido'
    res.status(400).json({
      success: false,
      mensaje
    })
  }
}

export const obtenerNegocios = async (req: Request, res: Response): Promise<void> => {
  try {
    const filtros = {
      categoria: req.query.categoria as string | undefined,
      ciudad: req.query.ciudad as string | undefined
    }
    const negocios = await negocioService.obtenerNegocios(filtros)
    res.status(200).json({
      success: true,
      total: negocios.length,
      data: negocios
    })
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error desconocido'
    res.status(500).json({
      success: false,
      mensaje
    })
  }
}

export const obtenerMisNegocios = async (req: Request, res: Response): Promise<void> => {
  try {
    const usuarioId = req.usuario?.id
    if (!usuarioId) {
      res.status(401).json({
        success: false,
        mensaje: 'Usuario no autenticado'
      })
      return
    }

    const negocios = await negocioService.obtenerMisNegocios(usuarioId)
    res.status(200).json({
      success: true,
      total: negocios.length,
      data: negocios
    })
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error desconocido'
    res.status(500).json({
      success: false,
      mensaje
    })
  }
}

export const obtenerNegocioPorId = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
    const negocio = await negocioService.obtenerNegocioPorId(id)
    res.status(200).json({
      success: true,
      data: negocio
    })
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error desconocido'
    res.status(404).json({
      success: false,
      mensaje
    })
  }
}

export const actualizarNegocio = async (req: Request, res: Response): Promise<void> => {
  try {
    const usuarioId = req.usuario?.id
    if (!usuarioId) {
      res.status(401).json({
        success: false,
        mensaje: 'Usuario no autenticado'
      })
      return
    }

    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
    const negocio = await negocioService.actualizarNegocio(
      id,
      usuarioId,
      req.body
    )
    res.status(200).json({
      success: true,
      mensaje: 'Negocio actualizado exitosamente',
      data: negocio
    })
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error desconocido'
    res.status(400).json({
      success: false,
      mensaje
    })
  }
}

export const eliminarNegocio = async (req: Request, res: Response): Promise<void> => {
  try {
    const usuarioId = req.usuario?.id
    if (!usuarioId) {
      res.status(401).json({
        success: false,
        mensaje: 'Usuario no autenticado'
      })
      return
    }

    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
    await negocioService.eliminarNegocio(id, usuarioId)
    res.status(200).json({
      success: true,
      mensaje: 'Negocio eliminado exitosamente'
    })
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error desconocido'
    res.status(400).json({
      success: false,
      mensaje
    })
  }
}