
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://orsbgmydbscycntxqwgp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yc2JnbXlkYnNjeWNudHhxd2dwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4Mzk1ODcsImV4cCI6MjA3OTQxNTU4N30.Yx7iEf-GaLRf0WAeGs_7X-yEcc1MJJxkjeD_tIhTiRY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
