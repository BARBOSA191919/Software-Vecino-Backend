import * as productoService from '../producto.service';
import * as productoModel from '../producto.model';
import * as negocioModel from '../../negocios/negocio.model';

// Mock de los modelos
jest.mock('../producto.model');
jest.mock('../../negocios/negocio.model');

describe('ProductoService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('crearProducto', () => {
    it('debería crear un producto exitosamente', async () => {
      const mockNegocio = {
        id: 'negocio-1',
        usuario_id: 'user-1',
        nombre: 'Mi Tienda',
        activo: true
      };

      const mockProducto = {
        id: 'producto-1',
        negocio_id: 'negocio-1',
        nombre: 'Hamburguesa',
        descripcion: 'Deliciosa hamburguesa',
        precio: 15000,
        imagen_url: 'http://example.com/image.jpg'
      };

      (negocioModel.obtenerNegocioPorId as jest.Mock).mockResolvedValue(mockNegocio);
      (productoModel.crearProducto as jest.Mock).mockResolvedValue(mockProducto);

      const datos = {
        negocio_id: 'negocio-1',
        nombre: 'Hamburguesa',
        descripcion: 'Deliciosa hamburguesa',
        precio: 15000,
        imagen_url: 'http://example.com/image.jpg'
      };

      const result = await productoService.crearProducto('user-1', datos);

      expect(negocioModel.obtenerNegocioPorId).toHaveBeenCalledWith('negocio-1');
      expect(productoModel.crearProducto).toHaveBeenCalled();
      expect(result).toEqual(mockProducto);
    });

    it('debería lanzar error si falta negocio_id', async () => {
      const datos: any = {
        nombre: 'Hamburguesa',
        descripcion: 'Deliciosa hamburguesa',
        precio: 15000,
        imagen_url: 'http://example.com/image.jpg'
      };

      await expect(productoService.crearProducto('user-1', datos))
        .rejects.toThrow('Debes seleccionar un negocio');
    });

    it('debería lanzar error si el nombre está vacío', async () => {
      const datos: any = {
        negocio_id: 'negocio-1',
        nombre: '',
        descripcion: 'Deliciosa hamburguesa',
        precio: 15000,
        imagen_url: 'http://example.com/image.jpg'
      };

      await expect(productoService.crearProducto('user-1', datos))
        .rejects.toThrow('El nombre del producto es obligatorio');
    });

    it('debería lanzar error si la descripción está vacía', async () => {
      const datos = {
        negocio_id: 'negocio-1',
        nombre: 'Hamburguesa',
        descripcion: '',
        precio: 15000,
        imagen_url: 'http://example.com/image.jpg'
      };

      await expect(productoService.crearProducto('user-1', datos))
        .rejects.toThrow('La descripción del producto es obligatoria');
    });

    it('debería lanzar error si la imagen está vacía', async () => {
      const datos = {
        negocio_id: 'negocio-1',
        nombre: 'Hamburguesa',
        descripcion: 'Deliciosa hamburguesa',
        precio: 15000,
        imagen_url: ''
      };

      await expect(productoService.crearProducto('user-1', datos))
        .rejects.toThrow('La imagen del producto es obligatoria');
    });

    it('debería lanzar error si el precio no es válido', async () => {
      const datos = {
        negocio_id: 'negocio-1',
        nombre: 'Hamburguesa',
        descripcion: 'Deliciosa hamburguesa',
        precio: -100,
        imagen_url: 'http://example.com/image.jpg'
      };

      await expect(productoService.crearProducto('user-1', datos))
        .rejects.toThrow('El precio del producto debe ser mayor a 0');
    });

    it('debería lanzar error si el negocio no existe', async () => {
      const datos: any = {
        negocio_id: 'negocio-inexistente',
        nombre: 'Hamburguesa',
        descripcion: 'Deliciosa hamburguesa',
        precio: 15000,
        imagen_url: 'http://example.com/image.jpg'
      };

      (negocioModel.obtenerNegocioPorId as jest.Mock).mockRejectedValue(new Error('Negocio no encontrado'));

      await expect(productoService.crearProducto('user-1', datos))
        .rejects.toThrow('Negocio no encontrado');
    });

    it('debería lanzar error si el usuario no es dueño del negocio', async () => {
      const mockNegocio = {
        id: 'negocio-1',
        usuario_id: 'user-2',
        nombre: 'Tienda de otro',
        activo: true
      };

      const datos = {
        negocio_id: 'negocio-1',
        nombre: 'Hamburguesa',
        descripcion: 'Deliciosa hamburguesa',
        precio: 15000,
        imagen_url: 'http://example.com/image.jpg'
      };

      (negocioModel.obtenerNegocioPorId as jest.Mock).mockResolvedValue(mockNegocio);

      await expect(productoService.crearProducto('user-1', datos))
        .rejects.toThrow('No tienes permiso para publicar productos en este negocio');
    });

    it('debería lanzar error si el negocio está inactivo', async () => {
      const mockNegocio = {
        id: 'negocio-1',
        usuario_id: 'user-1',
        nombre: 'Mi Tienda',
        activo: false
      };

      const datos = {
        negocio_id: 'negocio-1',
        nombre: 'Hamburguesa',
        descripcion: 'Deliciosa hamburguesa',
        precio: 15000,
        imagen_url: 'http://example.com/image.jpg'
      };

      (negocioModel.obtenerNegocioPorId as jest.Mock).mockResolvedValue(mockNegocio);

      await expect(productoService.crearProducto('user-1', datos))
        .rejects.toThrow('No puedes publicar productos en un negocio inactivo');
    });
  });

  describe('obtenerProductos', () => {
    it('debería obtener todos los productos', async () => {
      const mockProductos = [
        { id: 'producto-1', nombre: 'Hamburguesa' },
        { id: 'producto-2', nombre: 'Pizza' }
      ];

      (productoModel.obtenerProductos as jest.Mock).mockResolvedValue(mockProductos);

      const result = await productoService.obtenerProductos();

      expect(productoModel.obtenerProductos).toHaveBeenCalled();
      expect(result).toEqual(mockProductos);
    });
  });

  describe('obtenerMisProductos', () => {
    it('debería obtener los productos de los negocios del usuario', async () => {
      const mockNegocios = [
        { id: 'negocio-1', usuario_id: 'user-1', activo: true },
        { id: 'negocio-2', usuario_id: 'user-1', activo: true }
      ];

      const mockProductos = [
        { id: 'producto-1', negocio_id: 'negocio-1', nombre: 'Hamburguesa' }
      ];

      (negocioModel.obtenerNegociosPorUsuario as jest.Mock).mockResolvedValue(mockNegocios);
      (productoModel.obtenerProductosPorNegocios as jest.Mock).mockResolvedValue(mockProductos);

      const result = await productoService.obtenerMisProductos('user-1');

      expect(negocioModel.obtenerNegociosPorUsuario).toHaveBeenCalledWith('user-1');
      expect(productoModel.obtenerProductosPorNegocios).toHaveBeenCalledWith(['negocio-1', 'negocio-2']);
      expect(result).toEqual(mockProductos);
    });

    it('debería filtrar negocios inactivos', async () => {
      const mockNegocios = [
        { id: 'negocio-1', usuario_id: 'user-1', activo: true },
        { id: 'negocio-2', usuario_id: 'user-1', activo: false }
      ];

      const mockProductos: any[] = [];

      (negocioModel.obtenerNegociosPorUsuario as jest.Mock).mockResolvedValue(mockNegocios);
      (productoModel.obtenerProductosPorNegocios as jest.Mock).mockResolvedValue(mockProductos);

      await productoService.obtenerMisProductos('user-1');

      expect(productoModel.obtenerProductosPorNegocios).toHaveBeenCalledWith(['negocio-1']);
    });
  });
});
