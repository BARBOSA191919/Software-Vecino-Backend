import process from "node:process";
import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

// EP-06: asigna coordenadas (latitud/longitud) a negocios activos que aun no las
// tienen, distribuyendolos alrededor del centro de Armenia, Quindio, para poder
// visualizarlos en el mapa interactivo.
//
// Usa la API de Supabase (SUPABASE_URL + SUPABASE_SERVICE_KEY), las mismas
// credenciales que hacen correr la app, en lugar de una conexion directa a
// Postgres (DATABASE_URL).

const ARMENIA = { lat: 4.533889, lng: -75.681389 };

// ~0.01 grados ≈ 1.1 km. Genera un desplazamiento aleatorio dentro de ~2.5 km.
function coordenadaCercana() {
  const offset = () => (Math.random() - 0.5) * 0.045;
  return {
    lat: +(ARMENIA.lat + offset()).toFixed(6),
    lng: +(ARMENIA.lng + offset()).toFixed(6),
  };
}

async function ejecutar() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;

  if (!url || !key) {
    throw new Error("Faltan SUPABASE_URL o SUPABASE_SERVICE_KEY en .env");
  }

  const supabase = createClient(url, key);

  // Negocios activos sin coordenadas
  const { data: negocios, error } = await supabase
    .from("negocios")
    .select("id, nombre")
    .eq("activo", true)
    .or("latitud.is.null,longitud.is.null");

  if (error) {
    console.error("Error al consultar negocios:", error.message);
    process.exitCode = 1;
    return;
  }

  if (!negocios || negocios.length === 0) {
    console.log("No hay negocios activos sin coordenadas. Nada que sembrar.");
    return;
  }

  let actualizados = 0;
  for (const negocio of negocios) {
    const { lat, lng } = coordenadaCercana();
    const { error: errUpd } = await supabase
      .from("negocios")
      .update({ latitud: lat, longitud: lng })
      .eq("id", negocio.id);

    if (errUpd) {
      console.error(`  ✗ ${negocio.nombre}: ${errUpd.message}`);
      continue;
    }
    actualizados += 1;
    console.log(`  ✓ ${negocio.nombre} -> (${lat}, ${lng})`);
  }

  console.log(
    `\n=== EXITO ===\n${actualizados} negocio(s) geolocalizado(s) alrededor de Armenia.\n` +
      `Abre el menu "Mapa" en el frontend para verlos como marcadores.`
  );
}

ejecutar().catch((err) => {
  console.error("Error al sembrar coordenadas:", err.message);
  process.exit(1);
});
