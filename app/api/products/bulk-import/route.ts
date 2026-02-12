import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { supabaseAdmin } from "@/lib/supabase/client";

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 });
        }

        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rows: any[] = XLSX.utils.sheet_to_json(sheet);

        const supabase = supabaseAdmin();
        let successCount = 0;
        const errors: any[] = [];

        for (const row of rows) {
            try {
                // Parse variants from string if provided
                let productVariants = [];
                if (row.Variants) {
                    try {
                        // Expected format: Color:Red|Hex:#FF0000|Sizes:S,M,L|Image:url;Color:Blue...
                        productVariants = row.Variants.split(';').map((vStr: string) => {
                            const parts = vStr.split('|');
                            const vObj: any = {};
                            parts.forEach(p => {
                                const [key, ...val] = p.split(':');
                                const value = val.join(':');
                                if (key.trim().toLowerCase() === 'color') vObj.color_en = value.trim();
                                if (key.trim().toLowerCase() === 'color_ar') vObj.color_ar = value.trim();
                                if (key.trim().toLowerCase() === 'hex') vObj.color_hex = value.trim();
                                if (key.trim().toLowerCase() === 'image') vObj.image_url = value.trim();
                                if (key.trim().toLowerCase() === 'sizes') vObj.sizes = value.split(',').map(s => s.trim());
                            });
                            // Fallbacks
                            if (!vObj.color_ar) vObj.color_ar = vObj.color_en;
                            if (!vObj.color_hex) vObj.color_hex = "#000000";
                            if (!vObj.sizes) vObj.sizes = ["S", "M", "L", "XL"];
                            return vObj;
                        });
                    } catch (e) {
                        console.error("Variant parse error for SKU", row.SKU, e);
                    }
                }

                const { error } = await supabase.from("products").upsert({
                    sku: row.SKU,
                    name_en: row.Name_EN,
                    name_ar: row.Name_AR,
                    description_en: row.Description_EN || "",
                    description_ar: row.Description_AR || "",
                    variants: productVariants,
                    wholesale_price: parseFloat(row.Price) || 0,
                    min_order_qty: parseInt(row.Min_Order) || 1,
                    stock_qty: 999999, // Production items
                    primary_image_url: row.Image_URL || "",
                    is_active: true,
                    category_slug: row.Category_Slug || "general"
                }, { onConflict: 'sku' });

                if (error) {
                    errors.push({ sku: row.SKU, error: error.message });
                } else {
                    successCount++;
                }
            } catch (err: any) {
                errors.push({ sku: row.SKU, error: err.message });
            }
        }

        return NextResponse.json({
            success: true,
            count: successCount,
            errors: errors.length > 0 ? errors : undefined
        });

    } catch (err: any) {
        console.error("Bulk import error:", err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
