import supabase from '../../config/database'

export interface Pedido {
  id: string
  usuario_id: string
  negocio_id: string
  total: number
  estado: string
  created_at: string
  updated_at: string
}

export interface DetallePedido {
  id: string
  pedido_id: string
  producto_id: string
  cantidad: number
  precio_unitario: number
  subtotal: number
  created_at: string
}

export interface HistorialEstado {
  id: string
  pedido_id: string
  estado_anterior: string | null
  estado_nuevo: string
  fecha_cambio: string
  created_at: string
}

export interface PedidoConDetalles extends Pedido {
  detalles: DetallePedido[]
  negocio: {
    id: string
    nombre: string
    direccion: string
  }
}

export const obtenerPedidosPorUsuario = async (usuarioId: string): Promise<Pedido[]> => {
  const { data, error } = await supabase
    .from('pedidos')
    .select('*, negocios(nombre, direccion)')
    .eq('usuario_id', usuarioId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Pedido[]
}

export const obtenerPedidoPorId = async (pedidoId: string): Promise<PedidoConDetalles | null> => {
  const { data, error } = await supabase
    .from('pedidos')
    .select('*, negocios(nombre, direccion)')
    .eq('id', pedidoId)
    .single()

  if (error) {
    console.error('Error fetching pedido:', error)
    throw error
  }
  if (!data) return null

  const pedido = data as any

  // Obtener detalles del pedido
  const { data: detalles, error: errorDetalles } = await supabase
    .from('detalles_pedido')
    .select('*, productos(nombre, imagen_url)')
    .eq('pedido_id', pedidoId)

  if (errorDetalles) {
    console.error('Error fetching detalles:', errorDetalles)
    throw errorDetalles
  }

  return {
    ...pedido,
    detalles: detalles || []
  }
}

export const obtenerPedidosPorNegocio = async (negocioId: string): Promise<Pedido[]> => {
  const { data, error } = await supabase
    .from('pedidos')
    .select('*, usuarios(nombre_completo, email)')
    .eq('negocio_id', negocioId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Pedido[]
}

export const actualizarEstadoPedido = async (pedidoId: string, nuevoEstado: string): Promise<Pedido> => {
  const { data, error } = await supabase
    .from('pedidos')
    .update({ estado: nuevoEstado, updated_at: new Date().toISOString() })
    .eq('id', pedidoId)
    .select()
    .single()

  if (error) throw error
  return data as Pedido
}

export const obtenerHistorialEstados = async (pedidoId: string): Promise<HistorialEstado[]> => {
  const { data, error } = await supabase
    .from('historial_estados')
    .select('*')
    .eq('pedido_id', pedidoId)
    .order('fecha_cambio', { ascending: false })

  if (error) {
    console.error('Error fetching historial:', error)
    throw error
  }
  return data as HistorialEstado[]
}

export const verificarPropiedadNegocio = async (usuarioId: string, negocioId: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('negocios')
    .select('id')
    .eq('id', negocioId)
    .eq('usuario_id', usuarioId)
    .single()

  if (error) return false
  return !!data
}

export const crearPedido = async (
  usuarioId: string,
  negocioId: string,
  items: { producto_id: string; cantidad: number }[]
): Promise<PedidoConDetalles> => {
  // Calcular el total
  let total = 0
  const detallesConPrecio: Array<{
    producto_id: string
    cantidad: number
    precio_unitario: number
    subtotal: number
  }> = []

  for (const item of items) {
    const { data: producto, error } = await supabase
      .from('productos')
      .select('precio')
      .eq('id', item.producto_id)
      .single()

    if (error) {
      console.error('Error fetching producto:', error)
      throw new Error(`Producto ${item.producto_id} no encontrado`)
    }
    if (!producto) {
      throw new Error(`Producto ${item.producto_id} no encontrado`)
    }

    const precioUnitario = Number(producto.precio)
    const subtotal = precioUnitario * item.cantidad
    total += subtotal

    detallesConPrecio.push({
      producto_id: item.producto_id,
      cantidad: item.cantidad,
      precio_unitario: precioUnitario,
      subtotal
    })
  }

  // Crear el pedido
  const { data: pedido, error: errorPedido } = await supabase
    .from('pedidos')
    .insert({
      usuario_id: usuarioId,
      negocio_id: negocioId,
      total,
      estado: 'pendiente'
    })
    .select('*, negocios(nombre, direccion)')
    .single()

  if (errorPedido) {
    console.error('Error creating pedido:', errorPedido)
    throw errorPedido
  }

  // Crear los detalles del pedido (sin join primero)
  const detallesInsertados = await Promise.all(
    detallesConPrecio.map(async (detalle) => {
      const { data, error } = await supabase
        .from('detalles_pedido')
        .insert({
          pedido_id: pedido.id,
          ...detalle
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating detalle:', error)
        throw error
      }
      return data
    })
  )

  // Obtener los detalles con información de productos
  const detalles = await Promise.all(
    detallesInsertados.map(async (detalle) => {
      const { data: producto, error } = await supabase
        .from('productos')
        .select('nombre, imagen_url')
        .eq('id', detalle.producto_id)
        .single()

      if (error) {
        console.error('Error fetching producto for detalle:', error)
        // Si falla, retornar el detalle sin información de producto
        return detalle
      }

      return {
        ...detalle,
        producto
      }
    })
  )

  return {
    ...pedido,
    detalles
  }
}
