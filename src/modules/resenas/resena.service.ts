import * as ResenaModel from './resena.model'

export const crearResena = async (usuarioId: string, negocioId: string, calificacion: number, comentario: string) => {
  // Verificar si el usuario ha realizado al menos un pedido
  const haComprado = await ResenaModel.verificarPedidoUsuario(usuarioId, negocioId)
  if (!haComprado) {
    throw new Error('Solo puedes reseñar un negocio si has realizado al menos un pedido.')
  }

  return await ResenaModel.crearResena({
    usuario_id: usuarioId,
    negocio_id: negocioId,
    calificacion,
    comentario
  })
}

export const obtenerResenas = async (negocioId: string) => {
  return await ResenaModel.obtenerResenasPorNegocio(negocioId)
}
