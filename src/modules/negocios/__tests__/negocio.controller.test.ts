import { Request, Response } from 'express';
import * as NegocioController from '../negocio.controller';
import * as negocioService from '../negocio.service';

// Mock del servicio
jest.mock('../negocio.service');

describe('NegocioController', () => {
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

  describe('crearNegocio', () => {
    it('debería crear un negocio exitosamente', async () => {
      const mockNegocio = {
        id: 'negocio-1',
        usuario_id: 'user-1',
        nombre: 'Mi Tienda',
        descripcion: 'Una tienda genial',
        categoria: 'Comida',
        direccion: 'Calle 123',
        ciudad: 'Armenia',
        horario: '9-5',
        imagen_url: null,
        activo: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      mockRequest.body = {
        nombre: 'Mi Tienda',
        descripcion: 'Una tienda genial',
        categoria: 'Comida',
        direccion: 'Calle 123',
        ciudad: 'Armenia',
        horario: '9-5'
      };

      (negocioService.crearNegocio as jest.Mock).mockResolvedValue(mockNegocio);

      await NegocioController.crearNegocio(mockRequest as Request, mockResponse as Response);

      expect(negocioService.crearNegocio).toHaveBeenCalledWith('user-1', mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        mensaje: 'Negocio creado exitosamente',
        data: mockNegocio
      });
    });

    it('debería retornar 401 si no hay usuario autenticado', async () => {
      mockRequest.usuario = undefined;

      await NegocioController.crearNegocio(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        mensaje: 'Usuario no autenticado'
      });
    });

    it('debería manejar errores del servicio', async () => {
      mockRequest.body = {
        nombre: '',
        categoria: 'Comida',
        direccion: 'Calle 123'
      };

      (negocioService.crearNegocio as jest.Mock).mockRejectedValue(new Error('El nombre del negocio es obligatorio'));

      await NegocioController.crearNegocio(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        mensaje: 'El nombre del negocio es obligatorio'
      });
    });
  });

  describe('obtenerNegocios', () => {
    it('debería obtener todos los negocios', async () => {
      const mockNegocios = [
        {
          id: 'negocio-1',
          nombre: 'Tienda 1',
          categoria: 'Comida',
          direccion: 'Calle 123'
        }
      ];

      mockRequest.query = {};
      (negocioService.obtenerNegocios as jest.Mock).mockResolvedValue(mockNegocios);

      await NegocioController.obtenerNegocios(mockRequest as Request, mockResponse as Response);

      expect(negocioService.obtenerNegocios).toHaveBeenCalledWith({
        categoria: undefined,
        ciudad: undefined
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        total: 1,
        data: mockNegocios
      });
    });

    it('debería obtener negocios con filtros', async () => {
      mockRequest.query = { categoria: 'Comida', ciudad: 'Armenia' };
      const mockNegocios: any[] = [];

      (negocioService.obtenerNegocios as jest.Mock).mockResolvedValue(mockNegocios);

      await NegocioController.obtenerNegocios(mockRequest as Request, mockResponse as Response);

      expect(negocioService.obtenerNegocios).toHaveBeenCalledWith({
        categoria: 'Comida',
        ciudad: 'Armenia'
      });
    });
  });

  describe('obtenerMisNegocios', () => {
    it('debería obtener los negocios del usuario autenticado', async () => {
      const mockNegocios = [
        {
          id: 'negocio-1',
          usuario_id: 'user-1',
          nombre: 'Mi Tienda'
        }
      ];

      (negocioService.obtenerMisNegocios as jest.Mock).mockResolvedValue(mockNegocios);

      await NegocioController.obtenerMisNegocios(mockRequest as Request, mockResponse as Response);

      expect(negocioService.obtenerMisNegocios).toHaveBeenCalledWith('user-1');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        total: 1,
        data: mockNegocios
      });
    });

    it('debería retornar 401 si no hay usuario autenticado', async () => {
      mockRequest.usuario = undefined;

      await NegocioController.obtenerMisNegocios(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        mensaje: 'Usuario no autenticado'
      });
    });
  });

  describe('obtenerNegocioPorId', () => {
    it('debería obtener un negocio por ID', async () => {
      const mockNegocio = {
        id: 'negocio-1',
        nombre: 'Mi Tienda',
        categoria: 'Comida'
      };

      mockRequest.params = { id: 'negocio-1' };
      (negocioService.obtenerNegocioPorId as jest.Mock).mockResolvedValue(mockNegocio);

      await NegocioController.obtenerNegocioPorId(mockRequest as Request, mockResponse as Response);

      expect(negocioService.obtenerNegocioPorId).toHaveBeenCalledWith('negocio-1');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockNegocio
      });
    });

    it('debería retornar 404 si el negocio no existe', async () => {
      mockRequest.params = { id: 'negocio-inexistente' };
      (negocioService.obtenerNegocioPorId as jest.Mock).mockRejectedValue(new Error('Negocio no encontrado'));

      await NegocioController.obtenerNegocioPorId(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          mensaje: 'Negocio no encontrado'
        })
      );
    });
  });

  describe('actualizarNegocio', () => {
    it('debería actualizar un negocio exitosamente', async () => {
      const mockNegocioActualizado = {
        id: 'negocio-1',
        nombre: 'Tienda Actualizada'
      };

      mockRequest.params = { id: 'negocio-1' };
      mockRequest.body = { nombre: 'Tienda Actualizada' };
      (negocioService.actualizarNegocio as jest.Mock).mockResolvedValue(mockNegocioActualizado);

      await NegocioController.actualizarNegocio(mockRequest as Request, mockResponse as Response);

      expect(negocioService.actualizarNegocio).toHaveBeenCalledWith('negocio-1', 'user-1', mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        mensaje: 'Negocio actualizado exitosamente',
        data: mockNegocioActualizado
      });
    });

    it('debería retornar 401 si no hay usuario autenticado', async () => {
      mockRequest.usuario = undefined;

      await NegocioController.actualizarNegocio(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        mensaje: 'Usuario no autenticado'
      });
    });
  });

  describe('eliminarNegocio', () => {
    it('debería eliminar un negocio exitosamente', async () => {
      mockRequest.params = { id: 'negocio-1' };
      (negocioService.eliminarNegocio as jest.Mock).mockResolvedValue({ id: 'negocio-1' });

      await NegocioController.eliminarNegocio(mockRequest as Request, mockResponse as Response);

      expect(negocioService.eliminarNegocio).toHaveBeenCalledWith('negocio-1', 'user-1');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        mensaje: 'Negocio eliminado exitosamente'
      });
    });

    it('debería retornar 401 si no hay usuario autenticado', async () => {
      mockRequest.usuario = undefined;

      await NegocioController.eliminarNegocio(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        mensaje: 'Usuario no autenticado'
      });
    });
  });
});
