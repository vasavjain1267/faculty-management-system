-- =====================================================
-- ANNEXURES TABLE
-- =====================================================
-- This table stores ONLY annexure-specific data that is NOT
-- already present in profiles or dependents tables.
-- Faculty profile data (name, department, doj, etc.) and
-- dependent data are auto-filled from existing tables.
-- =====================================================

create table if not exists public.annexures (
  id uuid primary key default gen_random_uuid(),
  
  -- Reference to faculty member
  faculty_id uuid not null,
  constraint fk_faculty foreign key (faculty_id)
    references profiles (id) on delete cascade,
  
  -- Type of annexure form
  annexure_type text not null,
  -- Examples: 'address-proof', 'annexure-a-passport', 'bonafide', 
  --           'ltc-office-memorandum', 'noc-visa', etc.
  
  -- JSONB storing ONLY fields NOT in profiles/dependents
  -- This is minimal, annexure-specific data only
  annexure_data jsonb not null default '{}',
  
  -- Workflow status
  status text not null default 'DRAFT',
  constraint chk_status check (status in ('DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED')),
  
  -- Admin remarks when reviewing
  admin_remarks text,
  
  -- Signed PDF URL (after admin approval)
  signed_pdf_url text,
  
  -- Admin who approved/signed
  approved_by uuid,
  constraint fk_approver foreign key (approved_by)
    references profiles (id),
  
  approved_at timestamptz,
  
  -- Timestamps
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Index for faculty lookup
create index if not exists idx_annexures_faculty_id on annexures(faculty_id);

-- Index for status-based queries
create index if not exists idx_annexures_status on annexures(status);

-- Index for faculty + status queries
create index if not exists idx_annexures_faculty_status on annexures(faculty_id, status);

-- Trigger to update updated_at
create or replace function update_annexures_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trigger_annexures_updated_at
  before update on annexures
  for each row
  execute function update_annexures_updated_at();

-- Enable RLS
alter table annexures enable row level security;

-- Faculty can view their own annexures
create policy "Faculty can view own annexures"
  on annexures for select
  using (auth.uid() = faculty_id);

-- Faculty can insert their own annexures
create policy "Faculty can create own annexures"
  on annexures for insert
  with check (auth.uid() = faculty_id);

-- Faculty can update their own DRAFT annexures
create policy "Faculty can update own draft annexures"
  on annexures for update
  using (auth.uid() = faculty_id and status = 'DRAFT');

-- Admin can view all annexures
create policy "Admin can view all annexures"
  on annexures for select
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Admin can update submitted/approved/rejected annexures
create policy "Admin can update submitted annexures"
  on annexures for update
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'admin'
    )
    and status in ('SUBMITTED', 'APPROVED', 'REJECTED')
  );

-- Comments
comment on table annexures is 'Stores annexure form submissions with workflow status. Only stores annexure-specific data; faculty data auto-filled from profiles table.';
comment on column annexures.annexure_data is 'JSONB storing ONLY fields not available in profiles or dependents tables';
comment on column annexures.status is 'Workflow: DRAFT (editable by faculty) → SUBMITTED (pending admin) → APPROVED (signed PDF) → REJECTED';
