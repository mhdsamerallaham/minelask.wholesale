const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
    console.log('--- Cleaning up old products ---');
    await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    // Fetch category IDs
    const { data: categories } = await supabase.from('categories').select('*');
    const eveningWear = categories.find(c => c.slug === 'evening-wear');
    const modestFashion = categories.find(c => c.slug === 'modest-fashion');

    console.log('--- Adding new products with per-variant images ---');

    const products = [
        {
            sku: 'MINEL-DR-001',
            category_id: eveningWear?.id,
            category_slug: 'evening-wear',
            name_en: 'Royal Velvet Evening Dress',
            name_ar: 'فستان سهرة مخملي ملكي',
            description_en: 'Premium royal velvet dress with intricate embroidery. Each color variant is uniquely crafted.',
            description_ar: 'فستان مخملي ملكي فاخر مع تطريز متقن. كل لون مصمم بشكل فريد.',
            wholesale_price: 155.00,
            min_order_qty: 3,
            stock_qty: 120,
            primary_image_url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800',
            variants: [
                {
                    color_en: 'Emerald Green',
                    color_ar: 'الأخضر الزمردي',
                    color_hex: '#043927',
                    image_url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800',
                    sizes: ['36', '38', '40', '42']
                },
                {
                    color_en: 'Midnight Blue',
                    color_ar: 'الأزرق الليلي',
                    color_hex: '#191970',
                    image_url: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=800',
                    sizes: ['38', '40', '42', '44']
                },
                {
                    color_en: 'Deep Ruby',
                    color_ar: 'ياقوتي عميق',
                    color_hex: '#841B2D',
                    image_url: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&q=80&w=800',
                    sizes: ['36', '38', '40']
                }
            ]
        },
        {
            sku: 'MINEL-AB-505',
            category_id: modestFashion?.id,
            category_slug: 'modest-fashion',
            name_en: 'Elegant Silk Abaya Collection',
            name_ar: 'مجموعة عبايات حريرية أنيقة',
            description_en: 'Flowy premium silk abaya with dedicated color photography.',
            description_ar: 'عباية حريرية فاخرة ومنسدلة مع تصوير مخصص لكل لون.',
            wholesale_price: 95.00,
            min_order_qty: 5,
            stock_qty: 200,
            primary_image_url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=800',
            variants: [
                {
                    color_en: 'Desert Sand',
                    color_ar: 'رمل الصحراء',
                    color_hex: '#EDC9AF',
                    image_url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=800',
                    sizes: ['S', 'M', 'L', 'XL']
                },
                {
                    color_en: 'Onyx Black',
                    color_ar: 'الأسود العقيقي',
                    color_hex: '#353935',
                    image_url: 'https://images.unsplash.com/photo-1560086581-2287c897f225?auto=format&fit=crop&q=80&w=800',
                    sizes: ['M', 'L', 'XL', 'XXL']
                }
            ]
        }
    ];

    const { error } = await supabase.from('products').insert(products);
    if (error) console.error('Error:', error);
    else console.log('Products with variant images added!');
}

seed();
