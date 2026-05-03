import * as negocioModel from '../negocios/negocio.model'
import * as productoModel from './producto.model'
import type { Producto, DatosProducto } from './producto.model'

interface DatosCrearProducto {
  negocio_id: string
  nombre: string
  descripcion: string
  precio: number | string
  imagen_url: string
}

export const crearProducto = async (
  usuarioId: string,
  datos: DatosCrearProducto
): Promise<Producto> => {
  if (!datos.negocio_id) {
    throw new Error('Debes seleccionar un negocio')
  }
  if (!datos.nombre || datos.nombre.trim() === '') {
    throw new Error('El nombre del producto es obligatorio')
  }
  if (!datos.descripcion || datos.descripcion.trim() === '') {
    throw new Error('La descripción del producto es obligatoria')
  }
  if (!datos.imagen_url || datos.imagen_url.trim() === '') {
    throw new Error('La imagen del producto es obligatoria')
  }

  const precio = Number(datos.precio)
  if (!Number.isFinite(precio) || precio <= 0) {
    throw new Error('El precio del producto debe ser mayor a 0')
  }

  let negocio
  try {
    negocio = await negocioModel.obtenerNegocioPorId(datos.negocio_id)
  } catch {
    throw new Error('Negocio no encontrado')
  }

  if (negocio.usuario_id !== usuarioId) {
    throw new Error('No tienes permiso para publicar productos en este negocio')
  }
  if (!negocio.activo) {
    throw new Error('No puedes publicar productos en un negocio inactivo')
  }

  const producto: DatosProducto = {
    negocio_id: negocio.id,
    nombre: datos.nombre.trim(),
    descripcion: datos.descripcion.trim(),
    precio,
    imagen_url: datos.imagen_url.trim()
  }

  return await productoModel.crearProducto(producto)
}

export const obtenerProductos = async (): Promise<Producto[]> => {
  return await productoModel.obtenerProductos()
}

export const obtenerMisProductos = async (usuarioId: string): Promise<Producto[]> => {
  const negocios = await negocioModel.obtenerNegociosPorUsuario(usuarioId)
  const negocioIds = negocios
    .filter((negocio) => negocio.activo)
    .map((negocio) => negocio.id)

  return await productoModel.obtenerProductosPorNegocios(negocioIds)
}
