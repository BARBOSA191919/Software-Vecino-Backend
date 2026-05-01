import { readFile } from "node:fs/promises";
import process from "node:process";
import { Client } from "pg";

async function ejecutar() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("Falta DATABASE_URL para ejecutar el setup de base de datos.");
  }

  const sql = await readFile(new URL("../supabase/schema.sql", import.meta.url), "utf8");

  const client = new Client({
    connectionString: databaseUrl,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  await client.connect();
  await client.query(sql);
  await client.end();

  console.log("Base de datos inicializada correctamente en Supabase.");
}

ejecutar().catch((error) => {
  console.error("Error al inicializar la base de datos:", error.message);
  process.exit(1);
});
