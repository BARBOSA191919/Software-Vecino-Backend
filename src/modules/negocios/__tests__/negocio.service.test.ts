import * as negocioService from '../negocio.service';
import * as negocioModel from '../negocio.model';

// Mock del modelo
jest.mock('../negocio.model');

describe('NegocioService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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

      (negocioModel.crearNegocio as jest.Mock).mockResolvedValue(mockNegocio);

      const datos = {
        nombre: 'Mi Tienda',
        descripcion: 'Una tienda genial',
        categoria: 'Comida',
        direccion: 'Calle 123',
        ciudad: 'Armenia',
        horario: '9-5'
      };

      const result = await negocioService.crearNegocio('user-1', datos);

      expect(negocioModel.crearNegocio).toHaveBeenCalled();
      expect(result).toEqual(mockNegocio);
    });

    it('debería lanzar error si el nombre está vacío', async () => {
      const datos: any = {
        nombre: '',
        categoria: 'Comida',
        direccion: 'Calle 123'
      };

      await expect(negocioService.crearNegocio('user-1', datos))
        .rejects.toThrow('El nombre del negocio es obligatorio');
    });

    it('debería lanzar error si falta la categoría', async () => {
      const datos: any = {
        nombre: 'Mi Tienda',
        direccion: 'Calle 123'
      };

      await expect(negocioService.crearNegocio('user-1', datos))
        .rejects.toThrow('La categoría es obligatoria');
    });

    it('debería lanzar error si falta la dirección', async () => {
      const datos: any = {
        nombre: 'Mi Tienda',
        categoria: 'Comida'
      };

      await expect(negocioService.crearNegocio('user-1', datos))
        .rejects.toThrow('La dirección es obligatoria');
    });
  });

  describe('obtenerNegocios', () => {
    it('debería obtener todos los negocios', async () => {
      const mockNegocios = [
        { id: 'negocio-1', nombre: 'Tienda 1' },
        { id: 'negocio-2', nombre: 'Tienda 2' }
      ];

      (negocioModel.obtenerNegocios as jest.Mock).mockResolvedValue(mockNegocios);

      const result = await negocioService.obtenerNegocios();

      expect(negocioModel.obtenerNegocios).toHaveBeenCalledWith(undefined);
      expect(result).toEqual(mockNegocios);
    });

    it('debería obtener negocios con filtros', async () => {
      const mockNegocios = [{ id: 'negocio-1', nombre: 'Tienda 1' }];
      const filtros = { categoria: 'Comida', ciudad: 'Armenia' };

      (negocioModel.obtenerNegocios as jest.Mock).mockResolvedValue(mockNegocios);

      const result = await negocioService.obtenerNegocios(filtros);

      expect(negocioModel.obtenerNegocios).toHaveBeenCalledWith(filtros);
      expect(result).toEqual(mockNegocios);
    });
  });

  describe('obtenerNegocioPorId', () => {
    it('debería obtener un negocio por ID', async () => {
      const mockNegocio = {
        id: 'negocio-1',
        nombre: 'Mi Tienda',
        categoria: 'Comida'
      };

      (negocioModel.obtenerNegocioPorId as jest.Mock).mockResolvedValue(mockNegocio);

      const result = await negocioService.obtenerNegocioPorId('negocio-1');

      expect(negocioModel.obtenerNegocioPorId).toHaveBeenCalledWith('negocio-1');
      expect(result).toEqual(mockNegocio);
    });

    it('debería lanzar error si el negocio no existe', async () => {
      (negocioModel.obtenerNegocioPorId as jest.Mock).mockResolvedValue(null);

      await expect(negocioService.obtenerNegocioPorId('negocio-inexistente'))
        .rejects.toThrow('Negocio no encontrado');
    });
  });

  describe('obtenerMisNegocios', () => {
    it('debería obtener los negocios de un usuario', async () => {
      const mockNegocios = [
        { id: 'negocio-1', usuario_id: 'user-1', nombre: 'Mi Tienda' }
      ];

      (negocioModel.obtenerNegociosPorUsuario as jest.Mock).mockResolvedValue(mockNegocios);

      const result = await negocioService.obtenerMisNegocios('user-1');

      expect(negocioModel.obtenerNegociosPorUsuario).toHaveBeenCalledWith('user-1');
      expect(result).toEqual(mockNegocios);
    });
  });

  describe('actualizarNegocio', () => {
    it('debería actualizar un negocio exitosamente', async () => {
      const mockNegocio = {
        id: 'negocio-1',
        usuario_id: 'user-1',
        nombre: 'Mi Tienda'
      };

      const mockNegocioActualizado = {
        ...mockNegocio,
        nombre: 'Tienda Actualizada'
      };

      (negocioModel.obtenerNegocioPorId as jest.Mock).mockResolvedValue(mockNegocio);
      (negocioModel.actualizarNegocio as jest.Mock).mockResolvedValue(mockNegocioActualizado);

      const result = await negocioService.actualizarNegocio('negocio-1', 'user-1', { nombre: 'Tienda Actualizada' });

      expect(negocioModel.obtenerNegocioPorId).toHaveBeenCalledWith('negocio-1');
      expect(negocioModel.actualizarNegocio).toHaveBeenCalledWith('negocio-1', { nombre: 'Tienda Actualizada' });
      expect(result).toEqual(mockNegocioActualizado);
    });

    it('debería lanzar error si el negocio no existe', async () => {
      (negocioModel.obtenerNegocioPorId as jest.Mock).mockResolvedValue(null);

      await expect(negocioService.actualizarNegocio('negocio-inexistente', 'user-1', { nombre: 'Nuevo' }))
        .rejects.toThrow('Negocio no encontrado');
    });

    it('debería lanzar error si el usuario no es dueño del negocio', async () => {
      const mockNegocio = {
        id: 'negocio-1',
        usuario_id: 'user-2',
        nombre: 'Tienda de otro'
      };

      (negocioModel.obtenerNegocioPorId as jest.Mock).mockResolvedValue(mockNegocio);

      await expect(negocioService.actualizarNegocio('negocio-1', 'user-1', { nombre: 'Nuevo' }))
        .rejects.toThrow('No tienes permiso para editar este negocio');
    });
  });

  describe('eliminarNegocio', () => {
    it('debería eliminar un negocio exitosamente', async () => {
      const mockNegocio = {
        id: 'negocio-1',
        usuario_id: 'user-1',
        nombre: 'Mi Tienda'
      };

      (negocioModel.obtenerNegocioPorId as jest.Mock).mockResolvedValue(mockNegocio);
      (negocioModel.eliminarNegocio as jest.Mock).mockResolvedValue(mockNegocio);

      const result = await negocioService.eliminarNegocio('negocio-1', 'user-1');

      expect(negocioModel.obtenerNegocioPorId).toHaveBeenCalledWith('negocio-1');
      expect(negocioModel.eliminarNegocio).toHaveBeenCalledWith('negocio-1');
      expect(result).toEqual(mockNegocio);
    });

    it('debería lanzar error si el negocio no existe', async () => {
      (negocioModel.obtenerNegocioPorId as jest.Mock).mockResolvedValue(null);

      await expect(negocioService.eliminarNegocio('negocio-inexistente', 'user-1'))
        .rejects.toThrow('Negocio no encontrado');
    });

    it('debería lanzar error si el usuario no es dueño del negocio', async () => {
      const mockNegocio = {
        id: 'negocio-1',
        usuario_id: 'user-2',
        nombre: 'Tienda de otro'
      };

      (negocioModel.obtenerNegocioPorId as jest.Mock).mockResolvedValue(mockNegocio);

      await expect(negocioService.eliminarNegocio('negocio-1', 'user-1'))
        .rejects.toThrow('No tienes permiso para eliminar este negocio');
    });
  });
});
