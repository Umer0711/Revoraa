-- Create table for disposable email domains
CREATE TABLE public.disposable_email_domains (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    domain TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.disposable_email_domains ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read access for all" ON public.disposable_email_domains FOR SELECT USING (true);

-- Insert common disposable domains
INSERT INTO public.disposable_email_domains (domain) VALUES 
('tempmail.com'),
('10minutemail.com'),
('guerrillamail.com'),
('mailinator.com'),
('yopmail.com'),
('throwawaymail.com');

-- Function to check and block disposable emails before insert on auth.users
CREATE OR REPLACE FUNCTION public.check_disposable_email()
RETURNS TRIGGER AS $$
DECLARE
    user_domain TEXT;
    is_disposable BOOLEAN;
BEGIN
    -- Extract domain from email
    user_domain := split_part(NEW.email, '@', 2);
    
    -- Check if domain exists in disposable list
    SELECT EXISTS (
        SELECT 1 FROM public.disposable_email_domains 
        WHERE domain = user_domain
    ) INTO is_disposable;
    
    IF is_disposable THEN
        RAISE EXCEPTION 'Disposable email addresses are not allowed. Please use a valid email address.';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users
DROP TRIGGER IF EXISTS block_disposable_email_trigger ON auth.users;
CREATE TRIGGER block_disposable_email_trigger
BEFORE INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.check_disposable_email();
