-- RUN THIS IN YOUR SUPABASE SQL EDITOR TO SETUP ACADEX DATABASE

-- 1. Create the `profiles` table to store extra user information (points, badges, year, etc.)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid references auth.users not null primary key,
  username text unique,
  name text,
  year text check (year in ('Junior', 'Wheeler', 'Senior')),
  avatar text,
  points integer default 0,
  badges jsonb default '[]'::jsonb,
  bio text,
  join_date date default CURRENT_DATE
);

-- 2. Turn off RLS (Row Level Security) temporarily for easier development
-- WARNING: Do not leave this disabled in production if your data is highly sensitive.
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- 3. Create a function that automatically generates a profile when a user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, name, year, avatar, points)
  values (
    new.id,
    new.raw_user_meta_data->>'username',
    new.raw_user_meta_data->>'name',
    new.raw_user_meta_data->>'year',
    new.raw_user_meta_data->>'avatar',
    0
  );
  return new;
end;
$$ language plpgsql security definer;

-- 4. Create the trigger to fire the function on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Done! Your database is ready.
