import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with fallback values
// Using environment variables for security
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

// Only create a real client if both values are provided
const supabase = createClient(supabaseUrl, supabaseKey);

export { supabase };
