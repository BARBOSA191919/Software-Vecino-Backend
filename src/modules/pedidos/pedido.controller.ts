import { Request, Response } from 'express'
import * as PedidoService from './pedido.service'

export const obtenerMisPedidos = async (req: Request, res: Response) => {
  try {
    const usuarioId = req.usuario?.id
    if (!usuarioId) {
      return res.status(401).json({ success: false, error: 'No autorizado' })
    }

    const pedidos = await PedidoService.obtenerMisPedidos(usuarioId)
    res.status(200).json({ success: true, data: pedidos })
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Error al obtener los pedidos', detail: error.message })
  }
}

export const obtenerPedidoPorId = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const pedidoId = Array.isArray(id) ? id[0] : id
    const pedido = await PedidoService.obtenerPedidoDetalle(pedidoId)
    res.status(200).json({ success: true, data: pedido })
  } catch (error: any) {
    if (error.message === 'Pedido no encontrado') {
      return res.status(404).json({ success: false, error: error.message })
    }
    res.status(500).json({ success: false, error: 'Error al obtener el pedido', detail: error.message })
  }
}

export const obtenerPedidosDeNegocio = async (req: Request, res: Response) => {
  try {
    const usuarioId = req.usuario?.id
    if (!usuarioId) {
      return res.status(401).json({ success: false, error: 'No autorizado' })
    }

    const { negocioId } = req.params
    const negocioIdParam = Array.isArray(negocioId) ? negocioId[0] : negocioId
    const pedidos = await PedidoService.obtenerPedidosNegocio(negocioIdParam)
    res.status(200).json({ success: true, data: pedidos })
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Error al obtener los pedidos del negocio', detail: error.message })
  }
}

export const actualizarEstadoPedido = async (req: Request, res: Response) => {
  try {
    const usuarioId = req.usuario?.id
    if (!usuarioId) {
      return res.status(401).json({ success: false, error: 'No autorizado' })
    }

    const { id } = req.params
    const pedidoId = Array.isArray(id) ? id[0] : id
    const { estado } = req.body

    if (!estado) {
      return res.status(400).json({ success: false, error: 'Falta el estado del pedido' })
    }

    const pedidoActualizado = await PedidoService.cambiarEstadoPedido(pedidoId, estado, usuarioId)
    res.status(200).json({ success: true, data: pedidoActualizado })
  } catch (error: any) {
    if (error.message === 'Pedido no encontrado') {
      return res.status(404).json({ success: false, error: error.message })
    }
    if (error.message === 'No tienes permiso para modificar este pedido') {
      return res.status(403).json({ success: false, error: error.message })
    }
    if (error.message === 'Estado no válido') {
      return res.status(422).json({ success: false, error: error.message })
    }
    res.status(500).json({ success: false, error: 'Error al actualizar el estado del pedido', detail: error.message })
  }
}

export const obtenerHistorialPedido = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const pedidoId = Array.isArray(id) ? id[0] : id
    const historial = await PedidoService.obtenerHistorialPedido(pedidoId)
    res.status(200).json({ success: true, data: historial })
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Error al obtener el historial del pedido', detail: error.message })
  }
}

export const crearPedido = async (req: Request, res: Response) => {
  try {
    const usuarioId = req.usuario?.id
    if (!usuarioId) {
      return res.status(401).json({ success: false, error: 'No autorizado' })
    }

    const { negocio_id, items } = req.body

    if (!negocio_id) {
      return res.status(400).json({ success: false, error: 'Falta el negocio_id' })
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, error: 'El pedido debe tener al menos un producto' })
    }

    const pedido = await PedidoService.crearPedido(usuarioId, negocio_id, items)
    res.status(201).json({ success: true, data: pedido })
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Error al crear el pedido', detail: error.message })
  }
}
