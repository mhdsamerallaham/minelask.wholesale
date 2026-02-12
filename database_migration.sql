-- Minel Aşk Wholesale - Database Migration
-- Created: 31.01.2026
-- Optimized for English and Arabic

-- TABLO 1: CATEGORIES
CREATE TABLE IF NOT EXISTS public.categories (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  slug varchar(100) NOT NULL UNIQUE,
  name_en varchar(100) NOT NULL,
  name_ar varchar(100) NOT NULL,
  description_en text,
  description_ar text,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  PRIMARY KEY (id)
);

-- TABLO 2: PRODUCTS
CREATE TABLE IF NOT EXISTS public.products (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  sku varchar(50) NOT NULL UNIQUE,
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  category_slug varchar(100),
  name_en varchar(255) NOT NULL,
  name_ar varchar(255) NOT NULL,
  description_en text,
  description_ar text,
  color_name_en varchar(50),
  color_name_ar varchar(50),
  color_hex varchar(7),
  variants jsonb DEFAULT '[]', -- JSON array of { color_en, color_ar, color_hex, sizes: [] }
  wholesale_price numeric(10,2) NOT NULL,
  min_order_qty integer DEFAULT 1,
  primary_image_url text,
  gallery_urls text[] DEFAULT '{}',
  is_active boolean DEFAULT true,
  stock_qty integer,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  PRIMARY KEY (id)
);

-- TABLO 3: ORDERS
CREATE TABLE IF NOT EXISTS public.orders (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  order_number varchar(50) NOT NULL UNIQUE,
  customer_name varchar(255) NOT NULL,
  customer_email varchar(255),
  customer_phone varchar(20) NOT NULL,
  customer_country varchar(100),
  items jsonb NOT NULL,
  total_price numeric(10,2) NOT NULL,
  currency varchar(3) DEFAULT 'USD',
  status varchar(50) DEFAULT 'pending',
  whatsapp_message_sent boolean DEFAULT false,
  whatsapp_sent_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  PRIMARY KEY (id)
);

-- TABLO 4: ADMIN SETTINGS
CREATE TABLE IF NOT EXISTS public.admin_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  setting_key varchar(100) NOT NULL UNIQUE,
  setting_value text,
  PRIMARY KEY (id)
);

-- SAMPLE DATA
INSERT INTO public.categories (slug, name_en, name_ar, display_order) VALUES
  ('evening-wear', 'Evening Wear', 'ملابس سهرة', 1),
  ('modest-fashion', 'Modest Fashion', 'أزياء محتشمة', 2),
  ('bridal', 'Bridal Collection', 'مجموعة الزفاف', 3)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.admin_settings (setting_key, setting_value) VALUES
  ('whatsapp_number', '+905551234567'),
  ('company_email', 'info@minelask.com'),
  ('min_order_value_usd', '100')
ON CONFLICT (setting_key) DO NOTHING;
