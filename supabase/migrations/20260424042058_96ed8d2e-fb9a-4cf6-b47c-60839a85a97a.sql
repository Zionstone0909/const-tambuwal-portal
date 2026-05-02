-- Applications table
create table public.applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique,
  applicant_id uuid references public.applicants(id) on delete cascade,
  programme text not null,
  level text,
  session text,
  nationality text,
  state_of_origin text,
  lga text,
  address text,
  jamb_number text,
  exam_summary text,
  next_of_kin_name text,
  next_of_kin_phone text,
  next_of_kin_relationship text,
  next_of_kin_address text,
  referee_name text,
  referee_phone text,
  referee_email text,
  documents jsonb not null default '[]'::jsonb,
  declaration_accepted boolean not null default false,
  status text not null default 'draft' check (status in ('draft','submitted')),
  submitted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.applications enable row level security;

create policy "Applicants can view their own application"
on public.applications for select to authenticated
using (auth.uid() = user_id);

create policy "Applicants can create their own application"
on public.applications for insert to authenticated
with check (auth.uid() = user_id);

create policy "Applicants can update their draft application"
on public.applications for update to authenticated
using (auth.uid() = user_id and status = 'draft')
with check (auth.uid() = user_id);

create trigger applications_set_updated_at
before update on public.applications
for each row execute function public.set_updated_at();

-- Storage bucket for admission documents (private)
insert into storage.buckets (id, name, public)
values ('admission-documents', 'admission-documents', false)
on conflict (id) do nothing;

create policy "Applicants can view own admission documents"
on storage.objects for select to authenticated
using (bucket_id = 'admission-documents' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Applicants can upload own admission documents"
on storage.objects for insert to authenticated
with check (bucket_id = 'admission-documents' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Applicants can update own admission documents"
on storage.objects for update to authenticated
using (bucket_id = 'admission-documents' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Applicants can delete own admission documents"
on storage.objects for delete to authenticated
using (bucket_id = 'admission-documents' and auth.uid()::text = (storage.foldername(name))[1]);