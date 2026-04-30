import supabase from '../../config/database'

export interface Negocio {
  id: string
  usuario_id: string
  nombre: string
  descripcion: string
  categoria: string
  direccion: string
  ciudad: string
  horario: string
  imagen_url: string | null
  activo: boolean
  created_at: string
  updated_at: string
}

export interface FiltrosNegocio {
  categoria?: string
  ciudad?: string
}

export interface DatosNegocio extends Omit<Negocio, 'id' | 'activo' | 'created_at' | 'updated_at'> {}

export const crearNegocio = async (datos: DatosNegocio): Promise<Negocio> => {
  const { data, error } = await supabase
    .from('negocios')
    .insert([datos])
    .select()
    .single()

  if (error) throw error
  return data as Negocio
}

export const obtenerNegocios = async (filtros: FiltrosNegocio = {}): Promise<Negocio[]> => {
  let query = supabase
    .from('negocios')
    .select('*')
    .eq('activo', true)

  if (filtros.categoria) {
    query = query.eq('categoria', filtros.categoria)
  }

  if (filtros.ciudad) {
    query = query.eq('ciudad', filtros.ciudad)
  }

  const { data, error } = await query
  if (error) throw error
  return data as Negocio[]
}

export const obtenerNegocioPorId = async (id: string): Promise<Negocio> => {
  const { data, error } = await supabase
    .from('negocios')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as Negocio
}

export const obtenerNegociosPorUsuario = async (usuarioId: string): Promise<Negocio[]> => {
  const { data, error } = await supabase
    .from('negocios')
    .select('*')
    .eq('usuario_id', usuarioId)

  if (error) throw error
  return data as Negocio[]
}

export const actualizarNegocio = async (id: string, datos: Partial<DatosNegocio>): Promise<Negocio> => {
  const { data, error } = await supabase
    .from('negocios')
    .update({ ...datos, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Negocio
}

export const eliminarNegocio = async (id: string): Promise<Negocio> => {
  const { data, error } = await supabase
    .from('negocios')
    .update({ activo: false })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Negocio
}