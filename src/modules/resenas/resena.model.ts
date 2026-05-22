import supabase from '../../config/database'

export interface Resena {
  id: string
  negocio_id: string
  usuario_id: string
  calificacion: number
  comentario: string | null
  created_at: string
  updated_at: string
}

export interface DatosResena extends Omit<Resena, 'id' | 'created_at' | 'updated_at'> {}

export const crearResena = async (datos: DatosResena): Promise<Resena> => {
  const { data, error } = await supabase
    .from('resenas')
    .insert([datos])
    .select()
    .single()

  if (error) throw error
  return data as Resena
}

export const obtenerResenasPorNegocio = async (negocioId: string): Promise<Resena[]> => {
  const { data, error } = await supabase
    .from('resenas')
    .select('*, usuarios(nombre_completo)')
    .eq('negocio_id', negocioId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Resena[]
}

export const verificarPedidoUsuario = async (usuarioId: string, negocioId: string): Promise<boolean> => {
  const { count, error } = await supabase
    .from('pedidos')
    .select('*', { count: 'exact', head: true })
    .eq('usuario_id', usuarioId)
    .eq('negocio_id', negocioId)
    .eq('estado', 'completado')

  if (error) throw error
  return (count || 0) > 0
}
