-- Profile photos: private storage bucket readable/writable by active family members only.
-- Run once in Supabase: SQL Editor -> New query -> paste -> Run.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('family-photos', 'family-photos', false, 2097152, array['image/jpeg'])
on conflict (id) do nothing;

create or replace function public.ft_is_active_member() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.members m where m.user_id = auth.uid() and m.active);
$$;

drop policy if exists "ft photos read"   on storage.objects;
drop policy if exists "ft photos insert" on storage.objects;
drop policy if exists "ft photos update" on storage.objects;
drop policy if exists "ft photos delete" on storage.objects;

create policy "ft photos read"   on storage.objects for select to authenticated
  using (bucket_id = 'family-photos' and public.ft_is_active_member());
create policy "ft photos insert" on storage.objects for insert to authenticated
  with check (bucket_id = 'family-photos' and public.ft_is_active_member());
create policy "ft photos update" on storage.objects for update to authenticated
  using (bucket_id = 'family-photos' and public.ft_is_active_member());
create policy "ft photos delete" on storage.objects for delete to authenticated
  using (bucket_id = 'family-photos' and public.ft_is_active_member());
