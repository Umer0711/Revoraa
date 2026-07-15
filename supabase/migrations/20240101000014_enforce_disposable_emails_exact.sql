-- Insert additional explicitly mentioned domains
INSERT INTO public.disposable_email_domains (domain) VALUES
  ('mail.tm'),
  ('temp-mail.org'),
  ('tempmail.com'),
  ('10minutemail.com'),
  ('10minutemail.net'),
  ('mailinator.com'),
  ('guerrillamail.com'),
  ('guerrillamailblock.com'),
  ('maildrop.cc'),
  ('mailnesia.com'),
  ('throwawaymail.com'),
  ('trashmail.com'),
  ('trashmail.net'),
  ('yopmail.com'),
  ('getnada.com'),
  ('moakt.com'),
  ('dropmail.me'),
  ('dropmail.xyz'),
  ('burnermail.io'),
  ('sharklasers.com'),
  ('spamgourmet.com'),
  ('fakeinbox.com'),
  ('emailondeck.com'),
  ('mintemail.com'),
  ('dispostable.com'),
  ('acoxs.com')
ON CONFLICT (domain) DO NOTHING;

-- Create or Replace the validation function with the EXACT requested error string
CREATE OR REPLACE FUNCTION public.check_disposable_email()
RETURNS TRIGGER AS $$
DECLARE
  email_domain text;
  is_disposable boolean;
BEGIN
  -- Extract domain from email (lowercase)
  email_domain := lower(split_part(NEW.email, '@', 2));

  -- Check if it exists in the blacklist
  SELECT EXISTS(
    SELECT 1 FROM public.disposable_email_domains WHERE domain = email_domain
  ) INTO is_disposable;

  IF is_disposable THEN
    RAISE EXCEPTION 'Temporary email addresses are not supported. Please sign up using your personal, work, or university email.';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Reattach trigger to auth.users (BEFORE INSERT)
DROP TRIGGER IF EXISTS check_disposable_email_trigger ON auth.users;
CREATE TRIGGER check_disposable_email_trigger
  BEFORE INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.check_disposable_email();
