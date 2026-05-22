import { Request, Response } from 'express'
import * as productoService from './producto.service'

export const crearProducto = async (req: Request, res: Response): Promise<void> => {
  try {
    const usuarioId = req.usuario?.id
    if (!usuarioId) {
      res.status(401).json({
        success: false,
        mensaje: 'Usuario no autenticado'
      })
      return
    }

    const producto = await productoService.crearProducto(usuarioId, req.body)
    res.status(201).json({
      success: true,
      mensaje: 'Producto publicado exitosamente',
      data: producto
    })
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error desconocido'
    res.status(400).json({
      success: false,
      mensaje
    })
  }
}

export const obtenerProductos = async (req: Request, res: Response): Promise<void> => {
  try {
    const productos = await productoService.obtenerProductos()
    res.status(200).json({
      success: true,
      total: productos.length,
      data: productos
    })
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error desconocido'
    res.status(500).json({
      success: false,
      mensaje
    })
  }
}

export const obtenerMisProductos = async (req: Request, res: Response): Promise<void> => {
  try {
    const usuarioId = req.usuario?.id
    if (!usuarioId) {
      res.status(401).json({
        success: false,
        mensaje: 'Usuario no autenticado'
      })
      return
    }

    const productos = await productoService.obtenerMisProductos(usuarioId)
    res.status(200).json({
      success: true,
      total: productos.length,
      data: productos
    })
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error desconocido'
    res.status(500).json({
      success: false,
      mensaje
    })
  }
}
