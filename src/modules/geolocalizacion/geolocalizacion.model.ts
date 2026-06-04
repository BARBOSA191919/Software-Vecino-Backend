import supabase from '../../config/database'

/**
 * Negocio con coordenadas, usado como fuente para el mapa interactivo (EP-06).
 * Solo se exponen los campos relevantes para renderizar un marcador.
 */
export interface NegocioGeolocalizado {
  id: string
  nombre: string
  descripcion: string
  categoria: string
  direccion: string
  ciudad: string
  imagen_url: string | null
  calificacion_promedio: number
  total_resenas: number
  latitud: number
  longitud: number
}

export interface FiltrosConsultaNegocios {
  categoria?: string
  ciudad?: string
}

/**
 * Obtiene los negocios activos que tienen coordenadas registradas.
 * El filtrado por categoria/ciudad se aplica en la consulta; el filtrado
 * por distancia y calificacion se realiza en la capa de servicio.
 */
export const obtenerNegociosGeolocalizados = async (
  filtros: FiltrosConsultaNegocios = {}
): Promise<NegocioGeolocalizado[]> => {
  let query = supabase
    .from('negocios')
    .select(
      'id, nombre, descripcion, categoria, direccion, ciudad, imagen_url, calificacion_promedio, total_resenas, latitud, longitud'
    )
    .eq('activo', true)
    .not('latitud', 'is', null)
    .not('longitud', 'is', null)

  if (filtros.categoria) {
    query = query.eq('categoria', filtros.categoria)
  }

  if (filtros.ciudad) {
    query = query.eq('ciudad', filtros.ciudad)
  }

  const { data, error } = await query
  if (error) throw error
  return (data ?? []) as NegocioGeolocalizado[]
}

/**
 * Devuelve las categorias distintas de negocios activos con coordenadas,
 * para alimentar el filtro de categorias del mapa.
 */
export const obtenerCategoriasDisponibles = async (): Promise<string[]> => {
  const { data, error } = await supabase
    .from('negocios')
    .select('categoria')
    .eq('activo', true)
    .not('latitud', 'is', null)
    .not('longitud', 'is', null)

  if (error) throw error

  const categorias = (data ?? [])
    .map((fila: { categoria: string }) => fila.categoria)
    .filter((categoria): categoria is string => Boolean(categoria))

  return Array.from(new Set(categorias)).sort()
}
