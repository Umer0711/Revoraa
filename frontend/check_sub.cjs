const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://czlesbvdcjacmftezcrw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6bGVzYnZkY2phY21mdGV6Y3J3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4Mzg1NDM3MSwiZXhwIjoyMDk5NDMwMzcxfQ.EbuEdrYsEn-q9xXSdGwmicDRZZ4HjQ_BeXFRGEONjgU';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const uid = 'e75ce61b-d0e1-440a-9563-54edd2c288e8';
  const { data, error } = await supabase.from('subscriptions').select('*').eq('user_id', uid).maybeSingle();
  console.log("Sub:", data, "Error:", error);
}
check();
