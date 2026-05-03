import supabase from '../../config/database'

export interface ProductoNegocio {
  id: string
  nombre: string
  categoria: string
  ciudad: string
  activo?: boolean
}

export interface Producto {
  id: string
  negocio_id: string
  nombre: string
  descripcion: string
  precio: number
  imagen_url: string
  activo: boolean
  created_at: string
  updated_at: string
  negocio?: ProductoNegocio
}

export interface DatosProducto extends Omit<Producto, 'id' | 'activo' | 'created_at' | 'updated_at' | 'negocio'> {}

interface ProductoRow extends Omit<Producto, 'negocio'> {
  negocio?: ProductoNegocio[] | ProductoNegocio | null
}

const PRODUCTO_SELECT = `
  id,
  negocio_id,
  nombre,
  descripcion,
  precio,
  imagen_url,
  activo,
  created_at,
  updated_at,
  negocio:negocios(
    id,
    nombre,
    categoria,
    ciudad,
    activo
  )
`

const normalizarProducto = (producto: ProductoRow): Producto => {
  const negocio = Array.isArray(producto.negocio) ? producto.negocio[0] : producto.negocio || undefined

  return {
    ...producto,
    negocio
  }
}

export const crearProducto = async (datos: DatosProducto): Promise<Producto> => {
  const { data, error } = await supabase
    .from('productos')
    .insert([datos])
    .select(PRODUCTO_SELECT)
    .single()

  if (error) throw error
  return normalizarProducto(data as unknown as ProductoRow)
}

export const obtenerProductos = async (): Promise<Producto[]> => {
  const { data, error } = await supabase
    .from('productos')
    .select(PRODUCTO_SELECT)
    .eq('activo', true)
    .order('created_at', { ascending: false })

  if (error) throw error

  return (data as unknown as ProductoRow[])
    .map(normalizarProducto)
    .filter((producto) => producto.negocio?.activo !== false)
}

export const obtenerProductosPorNegocios = async (negocioIds: string[]): Promise<Producto[]> => {
  if (!negocioIds.length) {
    return []
  }

  const { data, error } = await supabase
    .from('productos')
    .select(PRODUCTO_SELECT)
    .in('negocio_id', negocioIds)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data as unknown as ProductoRow[]).map(normalizarProducto)
}
