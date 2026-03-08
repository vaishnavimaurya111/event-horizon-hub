-- Allow admins to view ALL events (not just published or own)
CREATE POLICY "Admins can view all events"
ON public.events
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to update any event
CREATE POLICY "Admins can update all events"
ON public.events
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to delete any event
CREATE POLICY "Admins can delete all events"
ON public.events
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to view all registrations
CREATE POLICY "Admins can view all registrations"
ON public.registrations
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));