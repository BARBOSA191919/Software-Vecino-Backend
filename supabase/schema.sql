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
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
