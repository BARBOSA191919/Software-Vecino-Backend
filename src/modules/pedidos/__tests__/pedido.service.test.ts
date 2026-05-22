import * as PedidoService from '../pedido.service';
import * as PedidoModel from '../pedido.model';

// Mock del modelo
jest.mock('../pedido.model');

describe('PedidoService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('obtenerMisPedidos', () => {
    it('debería obtener los pedidos de un usuario', async () => {
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

      (PedidoModel.obtenerPedidosPorUsuario as jest.Mock).mockResolvedValue(mockPedidos);

      const result = await PedidoService.obtenerMisPedidos('user-1');

      expect(PedidoModel.obtenerPedidosPorUsuario).toHaveBeenCalledWith('user-1');
      expect(result).toEqual(mockPedidos);
    });
  });

  describe('obtenerPedidoDetalle', () => {
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

      (PedidoModel.obtenerPedidoPorId as jest.Mock).mockResolvedValue(mockPedido);

      const result = await PedidoService.obtenerPedidoDetalle('pedido-1');

      expect(PedidoModel.obtenerPedidoPorId).toHaveBeenCalledWith('pedido-1');
      expect(result).toEqual(mockPedido);
    });

    it('debería lanzar error si el pedido no existe', async () => {
      (PedidoModel.obtenerPedidoPorId as jest.Mock).mockResolvedValue(null);

      await expect(PedidoService.obtenerPedidoDetalle('pedido-inexistente'))
        .rejects.toThrow('Pedido no encontrado');
    });
  });

  describe('cambiarEstadoPedido', () => {
    it('debería cambiar el estado de un pedido exitosamente', async () => {
      const mockPedido = {
        id: 'pedido-1',
        usuario_id: 'user-1',
        negocio_id: 'negocio-1',
        total: 25000,
        estado: 'pendiente',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const mockPedidoActualizado = {
        ...mockPedido,
        estado: 'confirmado'
      };

      (PedidoModel.obtenerPedidoPorId as jest.Mock).mockResolvedValue(mockPedido);
      (PedidoModel.verificarPropiedadNegocio as jest.Mock).mockResolvedValue(true);
      (PedidoModel.actualizarEstadoPedido as jest.Mock).mockResolvedValue(mockPedidoActualizado);

      const result = await PedidoService.cambiarEstadoPedido('pedido-1', 'confirmado', 'user-1');

      expect(PedidoModel.obtenerPedidoPorId).toHaveBeenCalledWith('pedido-1');
      expect(PedidoModel.verificarPropiedadNegocio).toHaveBeenCalledWith('user-1', 'negocio-1');
      expect(PedidoModel.actualizarEstadoPedido).toHaveBeenCalledWith('pedido-1', 'confirmado');
      expect(result).toEqual(mockPedidoActualizado);
    });

    it('debería lanzar error si el pedido no existe', async () => {
      (PedidoModel.obtenerPedidoPorId as jest.Mock).mockResolvedValue(null);

      await expect(PedidoService.cambiarEstadoPedido('pedido-inexistente', 'confirmado', 'user-1'))
        .rejects.toThrow('Pedido no encontrado');
    });

    it('debería lanzar error si el usuario no es dueño del negocio', async () => {
      const mockPedido = {
        id: 'pedido-1',
        usuario_id: 'user-1',
        negocio_id: 'negocio-1',
        total: 25000,
        estado: 'pendiente',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      (PedidoModel.obtenerPedidoPorId as jest.Mock).mockResolvedValue(mockPedido);
      (PedidoModel.verificarPropiedadNegocio as jest.Mock).mockResolvedValue(false);

      await expect(PedidoService.cambiarEstadoPedido('pedido-1', 'confirmado', 'user-2'))
        .rejects.toThrow('No tienes permiso para modificar este pedido');
    });

    it('debería lanzar error si el estado no es válido', async () => {
      const mockPedido = {
        id: 'pedido-1',
        usuario_id: 'user-1',
        negocio_id: 'negocio-1',
        total: 25000,
        estado: 'pendiente',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      (PedidoModel.obtenerPedidoPorId as jest.Mock).mockResolvedValue(mockPedido);
      (PedidoModel.verificarPropiedadNegocio as jest.Mock).mockResolvedValue(true);

      await expect(PedidoService.cambiarEstadoPedido('pedido-1', 'estado_invalido', 'user-1'))
        .rejects.toThrow('Estado no válido');
    });
  });

  describe('obtenerHistorialPedido', () => {
    it('debería obtener el historial de estados de un pedido', async () => {
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

      (PedidoModel.obtenerHistorialEstados as jest.Mock).mockResolvedValue(mockHistorial);

      const result = await PedidoService.obtenerHistorialPedido('pedido-1');

      expect(PedidoModel.obtenerHistorialEstados).toHaveBeenCalledWith('pedido-1');
      expect(result).toEqual(mockHistorial);
    });
  });
});
