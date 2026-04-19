-- グループ（看護師仲間のグループ）
create table if not exists nurse_groups (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  invite_code text unique not null default substring(gen_random_uuid()::text, 1, 8),
  created_at timestamptz default now()
);

-- メンバー（グループに所属するユーザー）
create table if not exists nurse_members (
  id uuid default gen_random_uuid() primary key,
  group_id uuid references nurse_groups(id) on delete cascade not null,
  name text not null,
  color text not null default '#ec4899',
  device_id text not null,
  created_at timestamptz default now(),
  unique(group_id, device_id)
);

-- シフトデータ
create table if not exists nurse_shifts (
  id uuid default gen_random_uuid() primary key,
  member_id uuid references nurse_members(id) on delete cascade not null,
  date text not null,
  shift_type text not null,
  created_at timestamptz default now(),
  unique(member_id, date)
);

-- RLS policies
alter table nurse_groups enable row level security;
alter table nurse_members enable row level security;
alter table nurse_shifts enable row level security;

-- Allow all operations (no auth, using device_id for identification)
create policy "Allow all on nurse_groups" on nurse_groups for all using (true) with check (true);
create policy "Allow all on nurse_members" on nurse_members for all using (true) with check (true);
create policy "Allow all on nurse_shifts" on nurse_shifts for all using (true) with check (true);

-- Enable realtime
alter publication supabase_realtime add table nurse_shifts;
