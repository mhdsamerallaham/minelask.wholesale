import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { supabaseAdmin, supabase as supabaseAnon } from "@/lib/supabase/client";

export const dynamic = 'force-dynamic';

interface ParsedRow {
    name_en: string;
    name_ar: string;
    description_en: string;
    description_ar: string;
    category_slug: string;
    sku: string;
    wholesale_price: number;
    color_en: string;
    color_ar: string;
    color_hex: string;
    sizes: string[];
}

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 });
        }

        const buffer = await file.arrayBuffer();
        const uint8 = new Uint8Array(buffer);
        const fileName = file.name.toLowerCase();
        const isCSV = fileName.endsWith('.csv');

        let workbook;
        if (isCSV) {
            // For CSV: try UTF-8 with BOM, then fallback
            const decoder = new TextDecoder('utf-8');
            const csvText = decoder.decode(uint8);
            workbook = XLSX.read(csvText, { type: "string" });
        } else {
            // For XLSX/XLS: use buffer type
            workbook = XLSX.read(uint8, { type: "array" });
        }

        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rows: any[] = XLSX.utils.sheet_to_json(sheet);

        // Debug: if ?preview=true, return first row without saving
        const url = new URL(request.url);
        if (url.searchParams.get("preview") === "true") {
            return NextResponse.json({
                success: true,
                preview: true,
                file_name: file.name,
                file_type: file.type,
                file_size: file.size,
                is_csv: isCSV,
                total_rows: rows.length,
                columns: rows.length > 0 ? Object.keys(rows[0]) : [],
                first_row: rows.length > 0 ? rows[0] : null,
                second_row: rows.length > 1 ? rows[1] : null,
            });
        }

        if (rows.length === 0) {
            return NextResponse.json({ success: false, error: "Excel file is empty" }, { status: 400 });
        }

        // Try admin client first, fall back to anon client
        const supabase = supabaseAdmin() || supabaseAnon;
        if (!supabase || typeof supabase.from !== 'function') {
            return NextResponse.json({ success: false, error: "Database not configured. Check your NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local" }, { status: 500 });
        }

        // Parse all rows
        const parsedRows: ParsedRow[] = rows.map((row: any) => ({
            name_en: (row["Product Name (EN)"] || "").toString().trim(),
            name_ar: (row["Product Name (AR)"] || "").toString().trim(),
            description_en: (row["Description (EN)"] || "").toString().trim(),
            description_ar: (row["Description (AR)"] || "").toString().trim(),
            category_slug: (row["Category"] || "general").toString().trim(),
            sku: (row["SKU"] || "").toString().trim(),
            wholesale_price: parseFloat(row["Wholesale Price"]) || 0,
            color_en: (row["Color (EN)"] || "").toString().trim(),
            color_ar: (row["Color (AR)"] || "").toString().trim(),
            color_hex: (row["Hex Code"] || "#000000").toString().trim(),
            sizes: (row["Sizes"] || "S, M, L, XL").toString().split(",").map((s: string) => s.trim()).filter(Boolean),
        }));

        // Group rows by SKU — multiple rows with same SKU = multiple variants
        const productMap = new Map<string, {
            name_en: string;
            name_ar: string;
            description_en: string;
            description_ar: string;
            category_slug: string;
            sku: string;
            wholesale_price: number;
            variants: { color_en: string; color_ar: string; color_hex: string; sizes: string[]; image_url: string }[];
        }>();

        for (const row of parsedRows) {
            if (!row.sku) continue; // Skip rows without SKU

            if (productMap.has(row.sku)) {
                // Add variant to existing product
                const product = productMap.get(row.sku)!;
                product.variants.push({
                    color_en: row.color_en || "Default",
                    color_ar: row.color_ar || row.color_en || "Default",
                    color_hex: row.color_hex,
                    sizes: row.sizes,
                    image_url: "", // Images added later manually
                });
            } else {
                // Create new product entry
                productMap.set(row.sku, {
                    name_en: row.name_en,
                    name_ar: row.name_ar || row.name_en,
                    description_en: row.description_en,
                    description_ar: row.description_ar,
                    category_slug: row.category_slug,
                    sku: row.sku,
                    wholesale_price: row.wholesale_price,
                    variants: [{
                        color_en: row.color_en || "Default",
                        color_ar: row.color_ar || row.color_en || "Default",
                        color_hex: row.color_hex,
                        sizes: row.sizes,
                        image_url: "",
                    }],
                });
            }
        }

        // Fetch categories to resolve slugs to IDs
        const { data: categories } = await supabase.from("categories").select("id, slug").eq("is_active", true);
        const categoryMap = new Map<string, string>();
        (categories || []).forEach((cat: any) => categoryMap.set(cat.slug, cat.id));

        let successCount = 0;
        const errors: { sku: string; error: string }[] = [];

        for (const [sku, product] of productMap) {
            try {
                const categoryId = categoryMap.get(product.category_slug);

                const { error } = await supabase.from("products").upsert({
                    sku: product.sku,
                    name_en: product.name_en,
                    name_ar: product.name_ar,
                    description_en: product.description_en,
                    description_ar: product.description_ar,
                    variants: product.variants,
                    wholesale_price: product.wholesale_price,
                    min_order_qty: 1,
                    stock_qty: 999999,
                    primary_image_url: "",
                    is_active: true,
                    category_id: categoryId || null,
                    category_slug: product.category_slug,
                }, { onConflict: 'sku' });

                if (error) {
                    errors.push({ sku, error: error.message });
                } else {
                    successCount++;
                }
            } catch (err: any) {
                errors.push({ sku, error: err.message });
            }
        }

        return NextResponse.json({
            success: true,
            count: successCount,
            total_rows: parsedRows.length,
            total_products: productMap.size,
            errors: errors.length > 0 ? errors : undefined,
        });

    } catch (err: any) {
        console.error("Bulk import error:", err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
