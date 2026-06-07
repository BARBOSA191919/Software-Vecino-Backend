import { Request, Response } from 'express';
import * as ResenaController from '../resena.controller';
import * as resenaService from '../resena.service';

// Mock del servicio
jest.mock('../resena.service');

describe('ResenaController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRequest = {
      usuario: { id: 'user-1', email: 'test@example.com' }
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
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

      mockRequest.body = {
        negocioId: 'negocio-1',
        calificacion: 5,
        comentario: 'Excelente servicio'
      };

      (resenaService.crearResena as jest.Mock).mockResolvedValue(mockResena);

      await ResenaController.crearResena(mockRequest as Request, mockResponse as Response);

      expect(resenaService.crearResena).toHaveBeenCalledWith('user-1', 'negocio-1', 5, 'Excelente servicio');
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({ success: true, data: mockResena });
    });

    it('debería retornar 401 si no hay usuario autenticado', async () => {
      mockRequest.usuario = undefined;

      await ResenaController.crearResena(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ success: false, error: 'No autorizado' });
    });

    it('debería retornar 400 si faltan datos requeridos', async () => {
      mockRequest.body = {
        calificacion: 5
      };

      await ResenaController.crearResena(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ success: false, error: 'Faltan datos requeridos' });
    });

    it('debería retornar 422 si la calificación no está entre 1 y 5', async () => {
      mockRequest.body = {
        negocioId: 'negocio-1',
        calificacion: 6,
        comentario: 'Test'
      };

      await ResenaController.crearResena(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(422);
      expect(mockResponse.json).toHaveBeenCalledWith({ success: false, error: 'La calificación debe estar entre 1 y 5' });
    });

    it('debería retornar 403 si el usuario no ha comprado', async () => {
      mockRequest.body = {
        negocioId: 'negocio-1',
        calificacion: 5,
        comentario: 'Test'
      };

      (resenaService.crearResena as jest.Mock).mockRejectedValue(
        new Error('Solo puedes reseñar un negocio si has realizado al menos un pedido')
      );

      await ResenaController.crearResena(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Solo puedes reseñar un negocio si has realizado al menos un pedido'
      });
    });

    it('debería retornar 409 si ya reseñó el negocio', async () => {
      mockRequest.body = {
        negocioId: 'negocio-1',
        calificacion: 5,
        comentario: 'Test'
      };

      const error: any = new Error('Duplicate entry');
      error.code = '23505';
      (resenaService.crearResena as jest.Mock).mockRejectedValue(error);

      await ResenaController.crearResena(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(409);
      expect(mockResponse.json).toHaveBeenCalledWith({ success: false, error: 'Ya has reseñado este negocio' });
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
        }
      ];

      mockRequest.params = { negocioId: 'negocio-1' };
      (resenaService.obtenerResenas as jest.Mock).mockResolvedValue(mockResenas);

      await ResenaController.obtenerResenas(mockRequest as Request, mockResponse as Response);

      expect(resenaService.obtenerResenas).toHaveBeenCalledWith('negocio-1');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ success: true, data: mockResenas });
    });

    it('debería manejar errores del servicio', async () => {
      mockRequest.params = { negocioId: 'negocio-1' };
      (resenaService.obtenerResenas as jest.Mock).mockRejectedValue(new Error('Error de base de datos'));

      await ResenaController.obtenerResenas(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Error al obtener las reseñas',
        detail: 'Error de base de datos'
      });
    });
  });
});
