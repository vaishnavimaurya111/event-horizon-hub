
-- Drop all existing RESTRICTIVE policies and recreate as PERMISSIVE

-- EVENTS table
DROP POLICY IF EXISTS "Admins can delete all events" ON public.events;
DROP POLICY IF EXISTS "Admins can update all events" ON public.events;
DROP POLICY IF EXISTS "Admins can view all events" ON public.events;
DROP POLICY IF EXISTS "Anyone can view published events" ON public.events;
DROP POLICY IF EXISTS "Authenticated users can create events" ON public.events;
DROP POLICY IF EXISTS "Creators can delete own events" ON public.events;
DROP POLICY IF EXISTS "Creators can update own events" ON public.events;
DROP POLICY IF EXISTS "Creators can view own events" ON public.events;

CREATE POLICY "Anyone can view published events" ON public.events FOR SELECT USING (is_published = true);
CREATE POLICY "Admins can view all events" ON public.events FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Creators can view own events" ON public.events FOR SELECT TO authenticated USING (auth.uid() = created_by);
CREATE POLICY "Authenticated users can create events" ON public.events FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Creators can update own events" ON public.events FOR UPDATE TO authenticated USING (auth.uid() = created_by);
CREATE POLICY "Admins can update all events" ON public.events FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Creators can delete own events" ON public.events FOR DELETE TO authenticated USING (auth.uid() = created_by);
CREATE POLICY "Admins can delete all events" ON public.events FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- REGISTRATIONS table
DROP POLICY IF EXISTS "Admins can view all registrations" ON public.registrations;
DROP POLICY IF EXISTS "Authenticated users can register" ON public.registrations;
DROP POLICY IF EXISTS "Event creators can view registrations" ON public.registrations;
DROP POLICY IF EXISTS "Users can cancel own registration" ON public.registrations;
DROP POLICY IF EXISTS "Users can view own registrations" ON public.registrations;

CREATE POLICY "Users can view own registrations" ON public.registrations FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all registrations" ON public.registrations FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Event creators can view registrations" ON public.registrations FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM events WHERE events.id = registrations.event_id AND events.created_by = auth.uid()));
CREATE POLICY "Authenticated users can register" ON public.registrations FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can cancel own registration" ON public.registrations FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- PROFILES table
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- USER_ROLES table
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;

CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own role on signup" ON public.user_roles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- TEAMS table
DROP POLICY IF EXISTS "Anyone can view teams for published events" ON public.teams;
DROP POLICY IF EXISTS "Authenticated users can create teams" ON public.teams;
DROP POLICY IF EXISTS "Team creators can delete" ON public.teams;
DROP POLICY IF EXISTS "Team creators can update" ON public.teams;

CREATE POLICY "Anyone can view teams for published events" ON public.teams FOR SELECT USING (EXISTS (SELECT 1 FROM events WHERE events.id = teams.event_id AND events.is_published = true));
CREATE POLICY "Authenticated users can create teams" ON public.teams FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Team creators can update" ON public.teams FOR UPDATE TO authenticated USING (auth.uid() = created_by);
CREATE POLICY "Team creators can delete" ON public.teams FOR DELETE TO authenticated USING (auth.uid() = created_by);

-- TEAM_MEMBERS table
DROP POLICY IF EXISTS "Team members can view their teams" ON public.team_members;
DROP POLICY IF EXISTS "Users can join teams" ON public.team_members;
DROP POLICY IF EXISTS "Users can leave teams" ON public.team_members;

CREATE POLICY "Team members can view their teams" ON public.team_members FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM team_members tm WHERE tm.team_id = team_members.team_id AND tm.user_id = auth.uid()));
CREATE POLICY "Users can join teams" ON public.team_members FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can leave teams" ON public.team_members FOR DELETE TO authenticated USING (auth.uid() = user_id);
