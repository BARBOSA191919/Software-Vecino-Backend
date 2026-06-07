import { Request, Response } from 'express';
import * as ProductoController from '../producto.controller';
import * as productoService from '../producto.service';

// Mock del servicio
jest.mock('../producto.service');

describe('ProductoController', () => {
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

  describe('crearProducto', () => {
    it('debería crear un producto exitosamente', async () => {
      const mockProducto = {
        id: 'producto-1',
        negocio_id: 'negocio-1',
        nombre: 'Hamburguesa',
        descripcion: 'Deliciosa hamburguesa',
        precio: 15000,
        imagen_url: 'http://example.com/image.jpg'
      };

      mockRequest.body = {
        negocio_id: 'negocio-1',
        nombre: 'Hamburguesa',
        descripcion: 'Deliciosa hamburguesa',
        precio: 15000,
        imagen_url: 'http://example.com/image.jpg'
      };

      (productoService.crearProducto as jest.Mock).mockResolvedValue(mockProducto);

      await ProductoController.crearProducto(mockRequest as Request, mockResponse as Response);

      expect(productoService.crearProducto).toHaveBeenCalledWith('user-1', mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        mensaje: 'Producto publicado exitosamente',
        data: mockProducto
      });
    });

    it('debería retornar 401 si no hay usuario autenticado', async () => {
      mockRequest.usuario = undefined;

      await ProductoController.crearProducto(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        mensaje: 'Usuario no autenticado'
      });
    });

    it('debería manejar errores del servicio', async () => {
      mockRequest.body = {
        negocio_id: 'negocio-1',
        nombre: '',
        descripcion: 'Test',
        precio: 15000,
        imagen_url: 'http://example.com/image.jpg'
      };

      (productoService.crearProducto as jest.Mock).mockRejectedValue(new Error('El nombre del producto es obligatorio'));

      await ProductoController.crearProducto(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        mensaje: 'El nombre del producto es obligatorio'
      });
    });
  });

  describe('obtenerProductos', () => {
    it('debería obtener todos los productos', async () => {
      const mockProductos = [
        {
          id: 'producto-1',
          nombre: 'Hamburguesa',
          precio: 15000
        },
        {
          id: 'producto-2',
          nombre: 'Pizza',
          precio: 20000
        }
      ];

      (productoService.obtenerProductos as jest.Mock).mockResolvedValue(mockProductos);

      await ProductoController.obtenerProductos(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        total: 2,
        data: mockProductos
      });
    });

    it('debería manejar errores del servicio', async () => {
      (productoService.obtenerProductos as jest.Mock).mockRejectedValue(new Error('Error de base de datos'));

      await ProductoController.obtenerProductos(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        mensaje: 'Error de base de datos'
      });
    });
  });

  describe('obtenerMisProductos', () => {
    it('debería obtener los productos del usuario autenticado', async () => {
      const mockProductos = [
        {
          id: 'producto-1',
          negocio_id: 'negocio-1',
          nombre: 'Hamburguesa',
          precio: 15000
        }
      ];

      (productoService.obtenerMisProductos as jest.Mock).mockResolvedValue(mockProductos);

      await ProductoController.obtenerMisProductos(mockRequest as Request, mockResponse as Response);

      expect(productoService.obtenerMisProductos).toHaveBeenCalledWith('user-1');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        total: 1,
        data: mockProductos
      });
    });

    it('debería retornar 401 si no hay usuario autenticado', async () => {
      mockRequest.usuario = undefined;

      await ProductoController.obtenerMisProductos(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        mensaje: 'Usuario no autenticado'
      });
    });

    it('debería manejar errores del servicio', async () => {
      (productoService.obtenerMisProductos as jest.Mock).mockRejectedValue(new Error('Error de base de datos'));

      await ProductoController.obtenerMisProductos(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        mensaje: 'Error de base de datos'
      });
    });
  });
});
