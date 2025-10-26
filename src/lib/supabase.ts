import { createClient } from '@supabase/supabase-js';


// Initialize Supabase client
// Using environment variables for security
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };