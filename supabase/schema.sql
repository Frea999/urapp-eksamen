-- Kør i Supabase SQL Editor. Hver bruger kan kun se og ændre sine egne designs og billeder.

-- Designs
create table if not exists public.designs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null default 'Eget design',
  data jsonb not null,             -- farver, effekt og animation
  image_path text,                 -- sti i bucket "design-images", fx '<user_id>/<fil>.png'
  created_at timestamptz not null default now()
);

alter table public.designs enable row level security;

create policy "Egne designs: læs" on public.designs
  for select to authenticated using (user_id = (select auth.uid()));
create policy "Egne designs: opret" on public.designs
  for insert to authenticated with check (user_id = (select auth.uid()));
create policy "Egne designs: ret" on public.designs
  for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "Egne designs: slet" on public.designs
  for delete to authenticated using (user_id = (select auth.uid()));

-- Billeder
-- Privat bucket. Filer skal ligge i en mappe med brugerens id: <user_id>/<fil>
insert into storage.buckets (id, name, public)
values ('design-images', 'design-images', false)
on conflict (id) do nothing;

create policy "Egne billeder: læs" on storage.objects
  for select to authenticated
  using (bucket_id = 'design-images' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "Egne billeder: upload" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'design-images' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "Egne billeder: ret" on storage.objects
  for update to authenticated
  using (bucket_id = 'design-images' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "Egne billeder: slet" on storage.objects
  for delete to authenticated
  using (bucket_id = 'design-images' and (storage.foldername(name))[1] = (select auth.uid())::text);

-- Begrænsninger på billederne
-- Kun billeder og højst 5 MB pr. fil
update storage.buckets
set file_size_limit = 5242880,
    allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp']
where id = 'design-images';
