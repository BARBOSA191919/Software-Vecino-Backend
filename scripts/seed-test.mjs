import process from "node:process";
import { Client } from "pg";
import "dotenv/config";

async function ejecutar() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("Falta DATABASE_URL en .env");
  }

  const client = new Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();

  try {
    // Obtener el usuario por su correo
    const emailUsuario = 'ventas.synergy@gmail.com';
    const userRes = await client.query('SELECT id FROM public.usuarios WHERE email = $1 LIMIT 1', [emailUsuario]);
    
    if (userRes.rows.length === 0) {
      console.log('Error: Usuario no encontrado en public.usuarios. Asegúrate de haber iniciado sesión para que el trigger lo cree.');
      return;
    }
    const usuarioId = userRes.rows[0].id;
    console.log(`Usuario encontrado: ${usuarioId}`);

    // Insertar un negocio de prueba
    const negocioRes = await client.query(`
      INSERT INTO public.negocios (usuario_id, nombre, descripcion, categoria, direccion, ciudad, horario, imagen_url, activo)
      VALUES ($1, 'Ferretería Vecino', 'La mejor ferretería del barrio', 'Ferretería', 'Calle Falsa 123', 'Armenia', '8am - 6pm', 'https://placehold.co/600x400/orange/white?text=Ferreteria', true)
      RETURNING id
    `, [usuarioId]);
    const negocioId = negocioRes.rows[0].id;
    console.log(`Negocio creado: ${negocioId}`);

    // Insertar un producto de prueba
    await client.query(`
      INSERT INTO public.productos (negocio_id, nombre, descripcion, precio, imagen_url, activo)
      VALUES ($1, 'Martillo de Acero', 'Martillo resistente para trabajos pesados', 25000, 'https://placehold.co/400x400/gray/white?text=Martillo', true)
    `, [negocioId]);
    console.log(`Producto creado para el negocio.`);

    // Crear el pedido falso
    await client.query(`
      INSERT INTO public.pedidos (usuario_id, negocio_id, total, estado)
      VALUES ($1, $2, 25000, 'completado')
    `, [usuarioId, negocioId]);
    console.log(`Pedido falso creado con éxito.`);

    console.log('\\n\\n=== EXITO ===\\nYa puedes ir al menú "Catalogo" en tu navegador y verás el negocio. ¡Hazle clic y podrás reseñarlo!');
  } catch (err) {
    console.error("Error al inyectar datos de prueba:", err);
  } finally {
    await client.end();
  }
}

ejecutar();
