create extension if not exists "pgcrypto";

do $$
begin
  if not exists (select 1 from pg_type where typname = 'rol_usuario') then
    create type public.rol_usuario as enum ('usuario', 'vendedor');
  end if;
end
$$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'estado_pedido') then
    create type public.estado_pedido as enum ('pendiente', 'confirmado', 'en_preparacion', 'en_camino', 'entregado');
  end if;
end
$$;

create table if not exists public.usuarios (
  id uuid primary key,
  nombre_completo text not null default 'Vecino',
  email text unique,
  rol public.rol_usuario not null default 'usuario',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.negocios (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references public.usuarios(id) on delete cascade,
  nombre text not null,
  descripcion text not null default '',
  categoria text not null,
  direccion text not null,
  ciudad text not null default 'Armenia',
  horario text not null default '',
  imagen_url text,
  activo boolean not null default true,
  calificacion_promedio numeric(3,2) not null default 0,
  total_resenas integer not null default 0,
  latitud double precision,
  longitud double precision,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- EP-06 Geolocalizacion: coordenadas para el mapa interactivo.
-- Se agregan de forma idempotente para bases ya creadas.
alter table public.negocios add column if not exists latitud double precision;
alter table public.negocios add column if not exists longitud double precision;

-- Restringe rangos validos de coordenadas (idempotente).
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'negocios_latitud_check') then
    alter table public.negocios
      add constraint negocios_latitud_check check (latitud is null or (latitud >= -90 and latitud <= 90));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'negocios_longitud_check') then
    alter table public.negocios
      add constraint negocios_longitud_check check (longitud is null or (longitud >= -180 and longitud <= 180));
  end if;
end
$$;

-- Indice para acelerar el filtrado de negocios geolocalizados.
create index if not exists idx_negocios_coordenadas
  on public.negocios (latitud, longitud)
  where activo = true and latitud is not null and longitud is not null;

create table if not exists public.productos (
  id uuid primary key default gen_random_uuid(),
  negocio_id uuid not null references public.negocios(id) on delete cascade,
  nombre text not null,
  descripcion text not null,
  precio numeric(10,2) not null check (precio > 0),
  imagen_url text not null,
  activo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.pedidos (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references public.usuarios(id) on delete cascade,
  negocio_id uuid not null references public.negocios(id) on delete cascade,
  total numeric(10,2) not null check (total >= 0),
  estado public.estado_pedido not null default 'pendiente',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.detalles_pedido (
  id uuid primary key default gen_random_uuid(),
  pedido_id uuid not null references public.pedidos(id) on delete cascade,
  producto_id uuid not null references public.productos(id) on delete cascade,
  cantidad integer not null check (cantidad > 0),
  precio_unitario numeric(10,2) not null check (precio_unitario > 0),
  subtotal numeric(10,2) not null check (subtotal >= 0),
  created_at timestamptz not null default now()
);

create table if not exists public.historial_estados (
  id uuid primary key default gen_random_uuid(),
  pedido_id uuid not null references public.pedidos(id) on delete cascade,
  estado_anterior public.estado_pedido,
  estado_nuevo public.estado_pedido not null,
  fecha_cambio timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.resenas (
  id uuid primary key default gen_random_uuid(),
  negocio_id uuid not null references public.negocios(id) on delete cascade,
  usuario_id uuid not null references public.usuarios(id) on delete cascade,
  calificacion integer not null check (calificacion >= 1 and calificacion <= 5),
  comentario text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(negocio_id, usuario_id)
);

create or replace function public.actualizar_calificacion_negocio()
returns trigger as $$
begin
  if tg_op = 'INSERT' or tg_op = 'UPDATE' then
    update public.negocios
    set calificacion_promedio = (select coalesce(avg(calificacion), 0) from public.resenas where negocio_id = new.negocio_id),
        total_resenas = (select count(*) from public.resenas where negocio_id = new.negocio_id)
    where id = new.negocio_id;
  elsif tg_op = 'DELETE' then
    update public.negocios
    set calificacion_promedio = (select coalesce(avg(calificacion), 0) from public.resenas where negocio_id = old.negocio_id),
        total_resenas = (select count(*) from public.resenas where negocio_id = old.negocio_id)
    where id = old.negocio_id;
  end if;
  return null;
end;
$$ language plpgsql;

create trigger tr_actualizar_calificacion_negocio
after insert or update or delete on public.resenas
for each row execute function public.actualizar_calificacion_negocio();

/**
 * Trigger para registrar cambios de estado de pedidos en el historial
 * Se ejecuta automáticamente cuando se inserta o actualiza un pedido
 * Nota: Se usa cast explícito (::public.estado_pedido) para evitar errores de tipo
 * cuando se insertan valores de texto en columnas de tipo enum
 */
create or replace function public.registrar_cambio_estado_pedido()
returns trigger as $$
begin
  if tg_op = 'INSERT' then
    insert into public.historial_estados (pedido_id, estado_anterior, estado_nuevo)
    values (new.id, null, new.estado::public.estado_pedido);
  elsif tg_op = 'UPDATE' and old.estado is distinct from new.estado then
    insert into public.historial_estados (pedido_id, estado_anterior, estado_nuevo)
    values (new.id, old.estado::public.estado_pedido, new.estado::public.estado_pedido);
  end if;
  return new;
end;
$$ language plpgsql;

create trigger tr_registrar_cambio_estado_pedido
after insert or update on public.pedidos
for each row execute function public.registrar_cambio_estado_pedido();
