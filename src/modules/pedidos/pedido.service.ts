import * as PedidoModel from './pedido.model'

export const obtenerMisPedidos = async (usuarioId: string) => {
  return await PedidoModel.obtenerPedidosPorUsuario(usuarioId)
}

export const obtenerPedidoDetalle = async (pedidoId: string) => {
  const pedido = await PedidoModel.obtenerPedidoPorId(pedidoId)
  if (!pedido) {
    throw new Error('Pedido no encontrado')
  }
  return pedido
}

export const obtenerPedidosNegocio = async (negocioId: string) => {
  return await PedidoModel.obtenerPedidosPorNegocio(negocioId)
}

export const cambiarEstadoPedido = async (pedidoId: string, nuevoEstado: string, usuarioId: string) => {
  // Verificar que el pedido exista
  const pedido = await PedidoModel.obtenerPedidoPorId(pedidoId)
  if (!pedido) {
    throw new Error('Pedido no encontrado')
  }

  // Verificar que el usuario sea dueño del negocio
  const esPropietario = await PedidoModel.verificarPropiedadNegocio(usuarioId, pedido.negocio_id)
  if (!esPropietario) {
    throw new Error('No tienes permiso para modificar este pedido')
  }

  // Validar que el estado sea válido
  const estadosValidos = ['pendiente', 'confirmado', 'en_preparacion', 'en_camino', 'entregado']
  if (!estadosValidos.includes(nuevoEstado)) {
    throw new Error('Estado no válido')
  }

  return await PedidoModel.actualizarEstadoPedido(pedidoId, nuevoEstado)
}

export const obtenerHistorialPedido = async (pedidoId: string) => {
  return await PedidoModel.obtenerHistorialEstados(pedidoId)
}

export const crearPedido = async (usuarioId: string, negocioId: string, items: { producto_id: string; cantidad: number }[]) => {
  if (!items || items.length === 0) {
    throw new Error('El pedido debe tener al menos un producto')
  }
  return await PedidoModel.crearPedido(usuarioId, negocioId, items)
}
