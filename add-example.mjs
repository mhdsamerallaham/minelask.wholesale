
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function addExampleProduct() {
    console.log('Adding example product...');

    // Get category id for evening-wear
    const { data: categories } = await supabase.from('categories').select('id, slug').eq('slug', 'evening-wear').single();

    if (!categories) {
        console.error('Evening Wear category not found');
        return;
    }

    const exampleProduct = {
        sku: 'EX-001',
        category_id: categories.id,
        category_slug: categories.slug,
        name_en: 'Elegant Silk Gown',
        name_ar: 'ثوب حريري أنيق',
        description_en: 'A beautiful elegant evening gown made of pure silk.',
        description_ar: 'فستان سهرة أنيق وجميل مصنوع من الحرير الخالص.',
        wholesale_price: 150.00,
        min_order_qty: 5,
        stock_qty: 100,
        color_name_en: 'Burgundy',
        color_name_ar: 'بورجوندي',
        color_hex: '#722F37',
        primary_image_url: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=800',
        is_active: true
    };

    const { data, error } = await supabase.from('products').insert([exampleProduct]).select();

    if (error) {
        console.error('Error adding example product:', error.message);
    } else {
        console.log('Successfully added example product:', data);
    }
}

addExampleProduct();
