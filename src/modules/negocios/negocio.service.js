const negocioModel = require('./negocio.model')

const crearNegocio = async (usuarioId, datos) => {
  if (!datos.nombre || datos.nombre.trim() === '') {
    throw new Error('El nombre del negocio es obligatorio')
  }
  if (!datos.categoria) {
    throw new Error('La categoría es obligatoria')
  }
  if (!datos.direccion) {
    throw new Error('La dirección es obligatoria')
  }

  const negocio = await negocioModel.crearNegocio({
    usuario_id: usuarioId,
    nombre: datos.nombre.trim(),
    descripcion: datos.descripcion || '',
    categoria: datos.categoria,
    direccion: datos.direccion,
    ciudad: datos.ciudad || 'Armenia',
    horario: datos.horario || '',
    imagen_url: datos.imagen_url || null,
  })

  return negocio
}

const obtenerNegocios = async (filtros) => {
  return await negocioModel.obtenerNegocios(filtros)
}

const obtenerNegocioPorId = async (id) => {
  const negocio = await negocioModel.obtenerNegocioPorId(id)
  if (!negocio) throw new Error('Negocio no encontrado')
  return negocio
}

const obtenerMisNegocios = async (usuarioId) => {
  return await negocioModel.obtenerNegociosPorUsuario(usuarioId)
}

const actualizarNegocio = async (id, usuarioId, datos) => {
  const negocio = await negocioModel.obtenerNegocioPorId(id)
  if (!negocio) throw new Error('Negocio no encontrado')
  if (negocio.usuario_id !== usuarioId) {
    throw new Error('No tienes permiso para editar este negocio')
  }
  return await negocioModel.actualizarNegocio(id, datos)
}

const eliminarNegocio = async (id, usuarioId) => {
  const negocio = await negocioModel.obtenerNegocioPorId(id)
  if (!negocio) throw new Error('Negocio no encontrado')
  if (negocio.usuario_id !== usuarioId) {
    throw new Error('No tienes permiso para eliminar este negocio')
  }
  return await negocioModel.eliminarNegocio(id)
}

module.exports = {
  crearNegocio,
  obtenerNegocios,
  obtenerNegocioPorId,
  obtenerMisNegocios,
  actualizarNegocio,
  eliminarNegocio
}