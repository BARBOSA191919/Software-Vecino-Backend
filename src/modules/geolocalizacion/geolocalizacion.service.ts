import * as geoModel from './geolocalizacion.model'
import type { NegocioGeolocalizado } from './geolocalizacion.model'

/**
 * Marcador listo para renderizar en el mapa: incluye la distancia
 * (en km) desde la ubicacion del consumidor hasta el negocio.
 */
export interface MarcadorNegocio extends NegocioGeolocalizado {
  distancia_km: number
}

export interface ParametrosBusquedaCercanos {
  latitud: number
  longitud: number
  /** Radio de busqueda en kilometros (por defecto 5 km). */
  radioKm?: number
  categoria?: string
  ciudad?: string
  /** Calificacion promedio minima (0 a 5). */
  calificacionMin?: number
}

// Radio medio de la Tierra en kilometros.
const RADIO_TIERRA_KM = 6371
const RADIO_DEFECTO_KM = 5
const RADIO_MAXIMO_KM = 50

const gradosARadianes = (grados: number): number => (grados * Math.PI) / 180

/**
 * Calcula la distancia en kilometros entre dos puntos geograficos
 * usando la formula de Haversine.
 */
export const calcularDistanciaKm = (
  latOrigen: number,
  lngOrigen: number,
  latDestino: number,
  lngDestino: number
): number => {
  const dLat = gradosARadianes(latDestino - latOrigen)
  const dLng = gradosARadianes(lngDestino - lngOrigen)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(gradosARadianes(latOrigen)) *
      Math.cos(gradosARadianes(latDestino)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return RADIO_TIERRA_KM * c
}

const esCoordenadaValida = (valor: unknown): valor is number =>
  typeof valor === 'number' && Number.isFinite(valor)

/**
 * Devuelve los negocios cercanos a una ubicacion, filtrados por categoria,
 * distancia y calificacion minima, ordenados del mas cercano al mas lejano.
 */
export const buscarNegociosCercanos = async (
  parametros: ParametrosBusquedaCercanos
): Promise<MarcadorNegocio[]> => {
  const { latitud, longitud, categoria, ciudad } = parametros

  if (!esCoordenadaValida(latitud) || !esCoordenadaValida(longitud)) {
    throw new Error('La latitud y la longitud son obligatorias y deben ser numeros validos')
  }
  if (latitud < -90 || latitud > 90) {
    throw new Error('La latitud debe estar entre -90 y 90')
  }
  if (longitud < -180 || longitud > 180) {
    throw new Error('La longitud debe estar entre -180 y 180')
  }

  let radioKm = parametros.radioKm ?? RADIO_DEFECTO_KM
  if (!Number.isFinite(radioKm) || radioKm <= 0) {
    throw new Error('El radio de busqueda debe ser un numero mayor a 0')
  }
  if (radioKm > RADIO_MAXIMO_KM) {
    radioKm = RADIO_MAXIMO_KM
  }

  const calificacionMin = parametros.calificacionMin ?? 0
  if (!Number.isFinite(calificacionMin) || calificacionMin < 0 || calificacionMin > 5) {
    throw new Error('La calificacion minima debe estar entre 0 y 5')
  }

  const negocios = await geoModel.obtenerNegociosGeolocalizados({ categoria, ciudad })

  const marcadores: MarcadorNegocio[] = negocios
    .filter((negocio) => esCoordenadaValida(negocio.latitud) && esCoordenadaValida(negocio.longitud))
    .map((negocio) => ({
      ...negocio,
      distancia_km:
        Math.round(
          calcularDistanciaKm(latitud, longitud, negocio.latitud, negocio.longitud) * 100
        ) / 100
    }))
    .filter((marcador) => marcador.distancia_km <= radioKm)
    .filter((marcador) => marcador.calificacion_promedio >= calificacionMin)
    .sort((a, b) => a.distancia_km - b.distancia_km)

  return marcadores
}

/**
 * Lista las categorias disponibles para el filtro del mapa.
 */
export const obtenerCategorias = async (): Promise<string[]> => {
  return await geoModel.obtenerCategoriasDisponibles()
}
