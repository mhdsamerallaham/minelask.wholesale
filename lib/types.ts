export interface ProductVariant {
    color_en: string;
    color_ar: string;
    color_hex: string;
    image_url?: string;
    sizes: string[]; // e.g., ["S", "M", "L", "XL"]
}

export interface Product {
    id: string;
    sku: string;
    name_en: string;
    name_ar: string;
    description_en?: string;
    description_ar?: string;
    color_name_en?: string;
    color_name_ar?: string;
    color_hex?: string;
    variants?: ProductVariant[];
    wholesale_price: number;
    min_order_qty: number;
    primary_image_url?: string;
    gallery_urls?: string[];
    stock_qty?: number;
    is_active: boolean;
    category_id?: string;
    category_slug?: string;
    created_at: string;
}

export interface Category {
    id: string;
    slug: string;
    name_en: string;
    name_ar: string;
    description_en?: string;
    description_ar?: string;
    display_order: number;
    is_active: boolean;
}

export interface CartItem {
    id: string; // Unique ID for cart management (e.g., product_id + color + size)
    product_id: string;
    product: Product;
    quantity: number;
    color: string;
    color_hex: string;
    size: string;
    price: number;
}

export interface Order {
    id: string;
    order_number: string;
    customer_name: string;
    customer_email?: string;
    customer_phone: string;
    customer_country?: string;
    items: CartItem[];
    total_price: number;
    currency: string;
    status: 'pending' | 'confirmed' | 'shipped' | 'completed' | 'cancelled';
    whatsapp_message_sent: boolean;
    created_at: string;
}

export interface AdminSettings {
    whatsapp_number: string;
    company_email: string;
    company_phone: string;
    shipping_info: string;
    payment_terms: string;
    instagram_url: string;
    youtube_url: string;
    min_order_value_usd: number;
}
