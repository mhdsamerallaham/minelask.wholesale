import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = (supabaseUrl && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : {} as any;

export const supabaseAdmin = () => {
    if (!supabaseUrl || !process.env.SUPABASE_SERVICE_KEY) {
        return null;
    }
    return createClient(
        supabaseUrl,
        process.env.SUPABASE_SERVICE_KEY,
        {
            auth: {
                persistSession: false,
            },
        }
    );
};
