-- Create table for disposable domains
CREATE TABLE IF NOT EXISTS public.disposable_email_domains (
  domain TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Secure the table with RLS (deny all by default for clients)
ALTER TABLE public.disposable_email_domains ENABLE ROW LEVEL SECURITY;

-- Insert the provided disposable domains
INSERT INTO public.disposable_email_domains (domain) VALUES
  ('10minutemail.com'),
  ('10minutemail.net'),
  ('mailinator.com'),
  ('guerrillamail.com'),
  ('guerrillamailblock.com'),
  ('tempmail.com'),
  ('tempmailo.com'),
  ('temp-mail.org'),
  ('maildrop.cc'),
  ('mailnesia.com'),
  ('dispostable.com'),
  ('throwawaymail.com'),
  ('yopmail.com'),
  ('sharklasers.com'),
  ('spamgourmet.com'),
  ('fakeinbox.com'),
  ('emailondeck.com'),
  ('mintemail.com'),
  ('trashmail.com'),
  ('trashmail.net'),
  ('moakt.com'),
  ('getnada.com'),
  ('dropmail.me'),
  ('dropmail.xyz'),
  ('mail.tm'),
  ('tmpmail.org'),
  ('tmpbox.net'),
  ('burnermail.io')
ON CONFLICT (domain) DO NOTHING;

-- Create the validation function
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
    RAISE EXCEPTION 'Disposable email addresses are not allowed. Please sign up using your personal, work, or school email address.';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach trigger to auth.users (BEFORE INSERT)
DROP TRIGGER IF EXISTS check_disposable_email_trigger ON auth.users;
CREATE TRIGGER check_disposable_email_trigger
  BEFORE INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.check_disposable_email();
