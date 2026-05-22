import { Request, Response } from 'express';
import * as PedidoController from '../pedido.controller';
import * as PedidoService from '../pedido.service';

// Mock del servicio
jest.mock('../pedido.service');

describe('PedidoController', () => {
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

  describe('obtenerMisPedidos', () => {
    it('debería obtener los pedidos del usuario autenticado', async () => {
      const mockPedidos = [
        {
          id: 'pedido-1',
          usuario_id: 'user-1',
          negocio_id: 'negocio-1',
          total: 25000,
          estado: 'pendiente',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      (PedidoService.obtenerMisPedidos as jest.Mock).mockResolvedValue(mockPedidos);

      await PedidoController.obtenerMisPedidos(mockRequest as Request, mockResponse as Response);

      expect(PedidoService.obtenerMisPedidos).toHaveBeenCalledWith('user-1');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ success: true, data: mockPedidos });
    });

    it('debería retornar 401 si no hay usuario autenticado', async () => {
      mockRequest.usuario = undefined;

      await PedidoController.obtenerMisPedidos(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ success: false, error: 'No autorizado' });
    });

    it('debería manejar errores del servicio', async () => {
      (PedidoService.obtenerMisPedidos as jest.Mock).mockRejectedValue(new Error('Error de base de datos'));

      await PedidoController.obtenerMisPedidos(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ 
        success: false, 
        error: 'Error al obtener los pedidos',
        detail: 'Error de base de datos'
      });
    });
  });

  describe('obtenerPedidoPorId', () => {
    it('debería obtener el detalle de un pedido', async () => {
      const mockPedido = {
        id: 'pedido-1',
        usuario_id: 'user-1',
        negocio_id: 'negocio-1',
        total: 25000,
        estado: 'pendiente',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        detalles: []
      };

      mockRequest.params = { id: 'pedido-1' };
      (PedidoService.obtenerPedidoDetalle as jest.Mock).mockResolvedValue(mockPedido);

      await PedidoController.obtenerPedidoPorId(mockRequest as Request, mockResponse as Response);

      expect(PedidoService.obtenerPedidoDetalle).toHaveBeenCalledWith('pedido-1');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ success: true, data: mockPedido });
    });

    it('debería retornar 404 si el pedido no existe', async () => {
      mockRequest.params = { id: 'pedido-inexistente' };
      (PedidoService.obtenerPedidoDetalle as jest.Mock).mockRejectedValue(new Error('Pedido no encontrado'));

      await PedidoController.obtenerPedidoPorId(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ success: false, error: 'Pedido no encontrado' });
    });
  });

  describe('actualizarEstadoPedido', () => {
    it('debería actualizar el estado de un pedido exitosamente', async () => {
      const mockPedidoActualizado = {
        id: 'pedido-1',
        usuario_id: 'user-1',
        negocio_id: 'negocio-1',
        total: 25000,
        estado: 'confirmado',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      mockRequest.params = { id: 'pedido-1' };
      mockRequest.body = { estado: 'confirmado' };
      (PedidoService.cambiarEstadoPedido as jest.Mock).mockResolvedValue(mockPedidoActualizado);

      await PedidoController.actualizarEstadoPedido(mockRequest as Request, mockResponse as Response);

      expect(PedidoService.cambiarEstadoPedido).toHaveBeenCalledWith('pedido-1', 'confirmado', 'user-1');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ success: true, data: mockPedidoActualizado });
    });

    it('debería retornar 400 si falta el estado', async () => {
      mockRequest.params = { id: 'pedido-1' };
      mockRequest.body = {};

      await PedidoController.actualizarEstadoPedido(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ success: false, error: 'Falta el estado del pedido' });
    });

    it('debería retornar 403 si no tiene permiso', async () => {
      mockRequest.params = { id: 'pedido-1' };
      mockRequest.body = { estado: 'confirmado' };
      (PedidoService.cambiarEstadoPedido as jest.Mock).mockRejectedValue(new Error('No tienes permiso para modificar este pedido'));

      await PedidoController.actualizarEstadoPedido(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({ success: false, error: 'No tienes permiso para modificar este pedido' });
    });

    it('debería retornar 422 si el estado no es válido', async () => {
      mockRequest.params = { id: 'pedido-1' };
      mockRequest.body = { estado: 'estado_invalido' };
      (PedidoService.cambiarEstadoPedido as jest.Mock).mockRejectedValue(new Error('Estado no válido'));

      await PedidoController.actualizarEstadoPedido(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(422);
      expect(mockResponse.json).toHaveBeenCalledWith({ success: false, error: 'Estado no válido' });
    });
  });

  describe('obtenerHistorialPedido', () => {
    it('debería obtener el historial de estados', async () => {
      const mockHistorial = [
        {
          id: 'hist-1',
          pedido_id: 'pedido-1',
          estado_anterior: null,
          estado_nuevo: 'pendiente',
          fecha_cambio: new Date().toISOString(),
          created_at: new Date().toISOString()
        }
      ];

      mockRequest.params = { id: 'pedido-1' };
      (PedidoService.obtenerHistorialPedido as jest.Mock).mockResolvedValue(mockHistorial);

      await PedidoController.obtenerHistorialPedido(mockRequest as Request, mockResponse as Response);

      expect(PedidoService.obtenerHistorialPedido).toHaveBeenCalledWith('pedido-1');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ success: true, data: mockHistorial });
    });

    it('debería manejar errores del servicio', async () => {
      mockRequest.params = { id: 'pedido-1' };
      (PedidoService.obtenerHistorialPedido as jest.Mock).mockRejectedValue(new Error('Error de base de datos'));

      await PedidoController.obtenerHistorialPedido(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ 
        success: false, 
        error: 'Error al obtener el historial del pedido',
        detail: 'Error de base de datos'
      });
    });
  });
});
