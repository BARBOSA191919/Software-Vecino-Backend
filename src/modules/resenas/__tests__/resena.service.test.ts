import * as resenaService from '../resena.service';
import * as resenaModel from '../resena.model';

// Mock del modelo
jest.mock('../resena.model');

describe('ResenaService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('crearResena', () => {
    it('debería crear una reseña exitosamente', async () => {
      const mockResena = {
        id: 'resena-1',
        usuario_id: 'user-1',
        negocio_id: 'negocio-1',
        calificacion: 5,
        comentario: 'Excelente servicio'
      };

      (resenaModel.verificarPedidoUsuario as jest.Mock).mockResolvedValue(true);
      (resenaModel.crearResena as jest.Mock).mockResolvedValue(mockResena);

      const result = await resenaService.crearResena('user-1', 'negocio-1', 5, 'Excelente servicio');

      expect(resenaModel.verificarPedidoUsuario).toHaveBeenCalledWith('user-1', 'negocio-1');
      expect(resenaModel.crearResena).toHaveBeenCalledWith({
        usuario_id: 'user-1',
        negocio_id: 'negocio-1',
        calificacion: 5,
        comentario: 'Excelente servicio'
      });
      expect(result).toEqual(mockResena);
    });

    it('debería lanzar error si el usuario no ha comprado', async () => {
      (resenaModel.verificarPedidoUsuario as jest.Mock).mockResolvedValue(false);

      await expect(resenaService.crearResena('user-1', 'negocio-1', 5, 'Test'))
        .rejects.toThrow('Solo puedes reseñar un negocio si has realizado al menos un pedido');
    });
  });

  describe('obtenerResenas', () => {
    it('debería obtener las reseñas de un negocio', async () => {
      const mockResenas = [
        {
          id: 'resena-1',
          negocio_id: 'negocio-1',
          calificacion: 5,
          comentario: 'Excelente'
        },
        {
          id: 'resena-2',
          negocio_id: 'negocio-1',
          calificacion: 4,
          comentario: 'Bueno'
        }
      ];

      (resenaModel.obtenerResenasPorNegocio as jest.Mock).mockResolvedValue(mockResenas);

      const result = await resenaService.obtenerResenas('negocio-1');

      expect(resenaModel.obtenerResenasPorNegocio).toHaveBeenCalledWith('negocio-1');
      expect(result).toEqual(mockResenas);
    });
  });
});
