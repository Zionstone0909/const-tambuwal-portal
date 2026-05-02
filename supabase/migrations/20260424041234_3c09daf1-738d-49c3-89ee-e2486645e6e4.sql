
-- Status enum
create type public.applicant_status as enum ('pending', 'submitted', 'under_review', 'accepted', 'rejected');

-- Applicants profile table
create table public.applicants (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  surname text not null,
  first_name text not null,
  other_name text,
  gender text,
  date_of_birth date,
  phone text,
  email text not null,
  programme_of_interest text,
  prior_qualification text,
  status public.applicant_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index applicants_user_id_idx on public.applicants(user_id);

-- Updated_at trigger
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger applicants_set_updated_at
before update on public.applicants
for each row execute function public.set_updated_at();

-- Auto-create profile from signup metadata
create or replace function public.handle_new_applicant()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.applicants (user_id, email, surname, first_name, other_name, gender, date_of_birth, phone, programme_of_interest, prior_qualification)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'surname', ''),
    coalesce(new.raw_user_meta_data->>'first_name', ''),
    nullif(new.raw_user_meta_data->>'other_name', ''),
    nullif(new.raw_user_meta_data->>'gender', ''),
    nullif(new.raw_user_meta_data->>'date_of_birth', '')::date,
    nullif(new.raw_user_meta_data->>'phone', ''),
    nullif(new.raw_user_meta_data->>'programme_of_interest', ''),
    nullif(new.raw_user_meta_data->>'prior_qualification', '')
  )
  on conflict (user_id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created_applicant
after insert on auth.users
for each row execute function public.handle_new_applicant();

-- RLS
alter table public.applicants enable row level security;

create policy "Applicants can view their own profile"
on public.applicants for select
to authenticated
using (auth.uid() = user_id);

create policy "Applicants can insert their own profile"
on public.applicants for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Applicants can update their own profile"
on public.applicants for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
