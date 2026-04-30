import * as negocioModel from './negocio.model'
import type { Negocio, DatosNegocio, FiltrosNegocio } from './negocio.model'

interface DatosCrearNegocio {
  nombre: string
  descripcion?: string
  categoria: string
  direccion: string
  ciudad?: string
  horario?: string
  imagen_url?: string | null
}

interface DatosActualizarNegocio extends Partial<DatosCrearNegocio> {}

export const crearNegocio = async (
  usuarioId: string,
  datos: DatosCrearNegocio
): Promise<Negocio> => {
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
    activo: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  } as any)

  return negocio
}

export const obtenerNegocios = async (filtros?: FiltrosNegocio): Promise<Negocio[]> => {
  return await negocioModel.obtenerNegocios(filtros)
}

export const obtenerNegocioPorId = async (id: string): Promise<Negocio> => {
  const negocio = await negocioModel.obtenerNegocioPorId(id)
  if (!negocio) throw new Error('Negocio no encontrado')
  return negocio
}

export const obtenerMisNegocios = async (usuarioId: string): Promise<Negocio[]> => {
  return await negocioModel.obtenerNegociosPorUsuario(usuarioId)
}

export const actualizarNegocio = async (
  id: string,
  usuarioId: string,
  datos: DatosActualizarNegocio
): Promise<Negocio> => {
  const negocio = await negocioModel.obtenerNegocioPorId(id)
  if (!negocio) throw new Error('Negocio no encontrado')
  if (negocio.usuario_id !== usuarioId) {
    throw new Error('No tienes permiso para editar este negocio')
  }
  return await negocioModel.actualizarNegocio(id, datos as Partial<DatosNegocio>)
}

export const eliminarNegocio = async (id: string, usuarioId: string): Promise<Negocio> => {
  const negocio = await negocioModel.obtenerNegocioPorId(id)
  if (!negocio) throw new Error('Negocio no encontrado')
  if (negocio.usuario_id !== usuarioId) {
    throw new Error('No tienes permiso para eliminar este negocio')
  }
  return await negocioModel.eliminarNegocio(id)
}