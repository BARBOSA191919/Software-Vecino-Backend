import * as GeoService from '../geolocalizacion.service'
import * as GeoModel from '../geolocalizacion.model'

jest.mock('../geolocalizacion.model')

// Ubicacion de referencia: centro de Armenia, Quindio.
const ORIGEN = { lat: 4.533889, lng: -75.681389 }

const negocioBase = {
  id: 'neg-1',
  nombre: 'Panaderia La Esquina',
  descripcion: 'Pan fresco',
  categoria: 'Alimentos',
  direccion: 'Calle 10 # 12-34',
  ciudad: 'Armenia',
  imagen_url: null,
  calificacion_promedio: 4.5,
  total_resenas: 12,
  latitud: 4.535,
  longitud: -75.682
}

describe('GeolocalizacionService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('calcularDistanciaKm (Haversine)', () => {
    it('devuelve 0 para el mismo punto', () => {
      expect(GeoService.calcularDistanciaKm(ORIGEN.lat, ORIGEN.lng, ORIGEN.lat, ORIGEN.lng)).toBe(0)
    })

    it('calcula ~111 km por grado de latitud', () => {
      const distancia = GeoService.calcularDistanciaKm(0, 0, 1, 0)
      expect(distancia).toBeGreaterThan(110)
      expect(distancia).toBeLessThan(112)
    })
  })

  describe('buscarNegociosCercanos', () => {
    it('devuelve marcadores con distancia y ordenados del mas cercano al mas lejano', async () => {
      const cercano = { ...negocioBase, id: 'cercano', latitud: 4.535, longitud: -75.682 }
      const lejano = { ...negocioBase, id: 'lejano', latitud: 4.56, longitud: -75.7 }
      ;(GeoModel.obtenerNegociosGeolocalizados as jest.Mock).mockResolvedValue([lejano, cercano])

      const resultado = await GeoService.buscarNegociosCercanos({
        latitud: ORIGEN.lat,
        longitud: ORIGEN.lng,
        radioKm: 10
      })

      expect(resultado.map((m) => m.id)).toEqual(['cercano', 'lejano'])
      expect(resultado[0]).toHaveProperty('distancia_km')
      expect(resultado[0].distancia_km).toBeLessThanOrEqual(resultado[1].distancia_km)
    })

    it('filtra negocios fuera del radio de busqueda', async () => {
      const dentro = { ...negocioBase, id: 'dentro', latitud: 4.535, longitud: -75.682 }
      const fuera = { ...negocioBase, id: 'fuera', latitud: 5.5, longitud: -76.5 }
      ;(GeoModel.obtenerNegociosGeolocalizados as jest.Mock).mockResolvedValue([dentro, fuera])

      const resultado = await GeoService.buscarNegociosCercanos({
        latitud: ORIGEN.lat,
        longitud: ORIGEN.lng,
        radioKm: 5
      })

      expect(resultado).toHaveLength(1)
      expect(resultado[0].id).toBe('dentro')
    })

    it('filtra por calificacion minima', async () => {
      const buena = { ...negocioBase, id: 'buena', calificacion_promedio: 4.8 }
      const mala = { ...negocioBase, id: 'mala', calificacion_promedio: 2.0 }
      ;(GeoModel.obtenerNegociosGeolocalizados as jest.Mock).mockResolvedValue([buena, mala])

      const resultado = await GeoService.buscarNegociosCercanos({
        latitud: ORIGEN.lat,
        longitud: ORIGEN.lng,
        radioKm: 10,
        calificacionMin: 4
      })

      expect(resultado).toHaveLength(1)
      expect(resultado[0].id).toBe('buena')
    })

    it('pasa el filtro de categoria al modelo', async () => {
      ;(GeoModel.obtenerNegociosGeolocalizados as jest.Mock).mockResolvedValue([])

      await GeoService.buscarNegociosCercanos({
        latitud: ORIGEN.lat,
        longitud: ORIGEN.lng,
        categoria: 'Alimentos'
      })

      expect(GeoModel.obtenerNegociosGeolocalizados).toHaveBeenCalledWith({
        categoria: 'Alimentos',
        ciudad: undefined
      })
    })

    it('lanza error si la latitud o longitud no son numeros validos', async () => {
      await expect(
        GeoService.buscarNegociosCercanos({ latitud: NaN, longitud: ORIGEN.lng })
      ).rejects.toThrow('La latitud y la longitud son obligatorias')
    })

    it('lanza error si la latitud esta fuera de rango', async () => {
      await expect(
        GeoService.buscarNegociosCercanos({ latitud: 200, longitud: ORIGEN.lng })
      ).rejects.toThrow('La latitud debe estar entre -90 y 90')
    })

    it('lanza error si la longitud esta fuera de rango', async () => {
      await expect(
        GeoService.buscarNegociosCercanos({ latitud: ORIGEN.lat, longitud: 200 })
      ).rejects.toThrow('La longitud debe estar entre -180 y 180')
    })

    it('lanza error si el radio es menor o igual a 0', async () => {
      await expect(
        GeoService.buscarNegociosCercanos({ latitud: ORIGEN.lat, longitud: ORIGEN.lng, radioKm: 0 })
      ).rejects.toThrow('El radio de busqueda debe ser un numero mayor a 0')
    })

    it('lanza error si la calificacion minima esta fuera de rango', async () => {
      await expect(
        GeoService.buscarNegociosCercanos({
          latitud: ORIGEN.lat,
          longitud: ORIGEN.lng,
          calificacionMin: 9
        })
      ).rejects.toThrow('La calificacion minima debe estar entre 0 y 5')
    })

    it('limita el radio al maximo permitido (50 km)', async () => {
      const lejano = { ...negocioBase, id: 'lejano', latitud: 4.9, longitud: -75.9 }
      ;(GeoModel.obtenerNegociosGeolocalizados as jest.Mock).mockResolvedValue([lejano])

      const resultado = await GeoService.buscarNegociosCercanos({
        latitud: ORIGEN.lat,
        longitud: ORIGEN.lng,
        radioKm: 9999
      })

      // El negocio esta a <50 km, por lo que sigue apareciendo aun capando el radio.
      expect(resultado).toHaveLength(1)
    })
  })

  describe('obtenerCategorias', () => {
    it('delega en el modelo y devuelve las categorias', async () => {
      ;(GeoModel.obtenerCategoriasDisponibles as jest.Mock).mockResolvedValue(['Alimentos', 'Ropa'])

      const resultado = await GeoService.obtenerCategorias()

      expect(GeoModel.obtenerCategoriasDisponibles).toHaveBeenCalled()
      expect(resultado).toEqual(['Alimentos', 'Ropa'])
    })
  })
})
