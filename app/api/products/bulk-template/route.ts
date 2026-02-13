import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

export async function GET() {
    const columns = [
        "Product Name (EN)",
        "Product Name (AR)",
        "Description (EN)",
        "Description (AR)",
        "Category",
        "SKU",
        "Wholesale Price",
        "Color (EN)",
        "Color (AR)",
        "Hex Code",
        "Sizes"
    ];

    const data = [
        [
            "Elegant Evening Dress",
            "فستان سهرة أنيق",
            "Premium silk evening dress for special occasions.",
            "فستان سهرة حريري فاخر للمناسبات الخاصة.",
            "evening-dresses",
            "MNL-EVE-001",
            "85.00",
            "Black",
            "أسود",
            "#000000",
            "S, M, L, XL"
        ],
        [
            "Floral Summer Skirt",
            "تنورة صيفية منقوشة بالزهور",
            "Lightweight floral skirt made from 100% cotton.",
            "تنورة صيفية خفيفة الوزن مصنوعة من القطن بنسبة 100٪.",
            "skirts",
            "MNL-SK-052",
            "45.00",
            "White",
            "أبيض",
            "#FFFFFF",
            "XS, S, M, L"
        ]
    ];

    // Create a new workbook
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([columns, ...data]);
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    // Generate buffer
    const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    return new NextResponse(buf, {
        headers: {
            "Content-Disposition": 'attachment; filename="minel_products_template.xlsx"',
            "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
    });
}
