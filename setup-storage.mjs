
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Using Service Key for storage management if available, otherwise Anon
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupStorage() {
    console.log('Setting up storage bucket...');

    // Check if bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();

    if (listError) {
        console.error('Error listing buckets:', listError.message);
        return;
    }

    const productsBucket = buckets.find(b => b.name === 'products');

    if (!productsBucket) {
        console.log('Creating "products" bucket...');
        const { data, error } = await supabase.storage.createBucket('products', {
            public: true,
            allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
            fileSizeLimit: 5242880 // 5MB
        });

        if (error) {
            console.error('Error creating bucket:', error.message);
            console.log('Please create a public bucket named "products" manually in Supabase Dashboard.');
        } else {
            console.log('Successfully created "products" bucket!');
        }
    } else {
        console.log('"products" bucket already exists.');
    }
}

setupStorage();
