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
    const pedido1Res = await client.query(`
      INSERT INTO public.pedidos (usuario_id, negocio_id, total, estado)
      VALUES ($1, $2, 25000, 'pendiente')
      RETURNING id
    `, [usuarioId, negocioId]);
    const pedido1Id = pedido1Res.rows[0].id;
    console.log(`Pedido 1 creado: ${pedido1Id}`);

    // Insertar detalle del pedido 1
    await client.query(`
      INSERT INTO public.detalles_pedido (pedido_id, producto_id, cantidad, precio_unitario, subtotal)
      VALUES ($1, (SELECT id FROM public.productos WHERE negocio_id = $2 LIMIT 1), 1, 25000, 25000)
    `, [pedido1Id, negocioId]);
    console.log(`Detalle del pedido 1 creado`);

    // Crear segundo pedido con estado diferente
    const pedido2Res = await client.query(`
      INSERT INTO public.pedidos (usuario_id, negocio_id, total, estado)
      VALUES ($1, $2, 50000, 'en_camino')
      RETURNING id
    `, [usuarioId, negocioId]);
    const pedido2Id = pedido2Res.rows[0].id;
    console.log(`Pedido 2 creado: ${pedido2Id}`);

    // Insertar detalle del pedido 2
    await client.query(`
      INSERT INTO public.detalles_pedido (pedido_id, producto_id, cantidad, precio_unitario, subtotal)
      VALUES ($1, (SELECT id FROM public.productos WHERE negocio_id = $2 LIMIT 1), 2, 25000, 50000)
    `, [pedido2Id, negocioId]);
    console.log(`Detalle del pedido 2 creado`);

    // Crear tercer pedido entregado
    const pedido3Res = await client.query(`
      INSERT INTO public.pedidos (usuario_id, negocio_id, total, estado)
      VALUES ($1, $2, 75000, 'entregado')
      RETURNING id
    `, [usuarioId, negocioId]);
    const pedido3Id = pedido3Res.rows[0].id;
    console.log(`Pedido 3 creado: ${pedido3Id}`);

    // Insertar detalle del pedido 3
    await client.query(`
      INSERT INTO public.detalles_pedido (pedido_id, producto_id, cantidad, precio_unitario, subtotal)
      VALUES ($1, (SELECT id FROM public.productos WHERE negocio_id = $2 LIMIT 1), 3, 25000, 75000)
    `, [pedido3Id, negocioId]);
    console.log(`Detalle del pedido 3 creado`);

    // Insertar historial de estados para el pedido 2
    await client.query(`
      INSERT INTO public.historial_estados (pedido_id, estado_anterior, estado_nuevo, fecha_cambio)
      VALUES 
        ($1, 'pendiente', 'confirmado', NOW() - INTERVAL '2 hours'),
        ($1, 'confirmado', 'en_preparacion', NOW() - INTERVAL '1 hour'),
        ($1, 'en_preparacion', 'en_camino', NOW() - INTERVAL '30 minutes')
    `, [pedido2Id]);
    console.log(`Historial de estados del pedido 2 creado`);

    // Insertar historial de estados para el pedido 3
    await client.query(`
      INSERT INTO public.historial_estados (pedido_id, estado_anterior, estado_nuevo, fecha_cambio)
      VALUES 
        ($1, 'pendiente', 'confirmado', NOW() - INTERVAL '1 day'),
        ($1, 'confirmado', 'en_preparacion', NOW() - INTERVAL '23 hours'),
        ($1, 'en_preparacion', 'en_camino', NOW() - INTERVAL '22 hours'),
        ($1, 'en_camino', 'entregado', NOW() - INTERVAL '21 hours')
    `, [pedido3Id]);
    console.log(`Historial de estados del pedido 3 creado`);

    console.log('\n\n=== EXITO ===\nYa puedes ir al menú "Catalogo" en tu navegador y verás el negocio. ¡Hazle clic y podrás reseñarlo!\n\nTambién se han creado 3 pedidos de prueba con diferentes estados para probar HU-06 y HU-09.');
  } catch (err) {
    console.error("Error al inyectar datos de prueba:", err);
  } finally {
    await client.end();
  }
}

ejecutar();
