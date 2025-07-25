import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL or Key is not defined in the environment variables.');
  // In a real application, you might want to throw an error to stop the server from starting
  // throw new Error('Supabase URL or Key is not defined.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
