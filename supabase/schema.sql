create extension if not exists "pgcrypto";

do $$
begin
  if not exists (select 1 from pg_type where typname = 'rol_usuario') then
    create type public.rol_usuario as enum ('usuario', 'vendedor');
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
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

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
  estado text not null default 'completado',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
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
