"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle2, Loader2, ArrowLeft, Download, Table2, Info } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { Category } from "@/lib/types";

const PREDEFINED_COLORS = [
    { label: "Black", hex: "#000000" },
    { label: "White", hex: "#FFFFFF" },
    { label: "Red", hex: "#FF0000" },
    { label: "Royal Blue", hex: "#4169E1" },
    { label: "Emerald", hex: "#50C878" },
    { label: "Gold", hex: "#FFD700" },
    { label: "Silver", hex: "#C0C0C0" },
    { label: "Beige", hex: "#F5F5DC" },
    { label: "Navy", hex: "#000080" },
    { label: "Bordeaux", hex: "#800000" },
    { label: "Pink", hex: "#FFC0CB" },
    { label: "Burgundy", hex: "#722F37" },
    { label: "Cream", hex: "#FFFDD0" },
    { label: "Dusty Rose", hex: "#DCAE96" },
    { label: "Olive", hex: "#808000" },
];

const EXCEL_COLUMNS = [
    { name: "Product Name (EN)", desc: "English product name", example: "Elegant Evening Dress" },
    { name: "Product Name (AR)", desc: "Arabic product name", example: "فستان سهرة أنيق" },
    { name: "Description (EN)", desc: "English description", example: "Premium silk evening dress..." },
    { name: "Description (AR)", desc: "Arabic description", example: "فستان سهرة حريري..." },
    { name: "Category", desc: "Category slug from list below", example: "evening-dresses" },
    { name: "SKU", desc: "Unique product code", example: "MNL-EVE-001" },
    { name: "Wholesale Price", desc: "Price in USD", example: "85.00" },
    { name: "Color (EN)", desc: "Color name in English", example: "Black" },
    { name: "Color (AR)", desc: "Color name in Arabic", example: "أسود" },
    { name: "Hex Code", desc: "Color hex or name from list", example: "#000000" },
    { name: "Sizes", desc: "Comma-separated sizes", example: "S, M, L, XL" },
];

export default function BulkUploadPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = use(params);
    const router = useRouter();
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [status, setStatus] = useState<{ success?: boolean; message?: string; error?: string; details?: any }>({});

    useEffect(() => {
        async function fetchCategories() {
            const { data } = await supabase.from("categories").select("*").eq("is_active", true);
            setCategories(data || []);
        }
        fetchCategories();
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile && (selectedFile.name.endsWith('.xlsx') || selectedFile.name.endsWith('.csv'))) {
            setFile(selectedFile);
            setStatus({});
        } else {
            alert("Please select a valid Excel (.xlsx) or CSV file.");
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        setLoading(true);
        setStatus({});

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("/api/products/bulk-import", {
                method: "POST",
                body: formData,
            });

            const result = await response.json();

            if (result.success) {
                const errMsg = result.errors ? ` (${result.errors.length} errors)` : "";
                setStatus({
                    success: true,
                    message: `✅ ${result.count} products imported from ${result.total_rows} rows${errMsg}`,
                    details: result.errors
                });
                if (!result.errors || result.errors.length === 0) {
                    setTimeout(() => router.push(`/${lang}/admin/products`), 3000);
                }
            } else {
                setStatus({ error: result.error || "Failed to import products." });
            }
        } catch (error) {
            setStatus({ error: "An unexpected error occurred during upload." });
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadTemplate = () => {
        // Generate a CSV template with headers
        const headers = EXCEL_COLUMNS.map(c => c.name).join(",");
        const exampleRow = EXCEL_COLUMNS.map(c => `"${c.example}"`).join(",");
        const csv = `${headers}\n${exampleRow}`;
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "minel_products_template.csv";
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-10 pb-20">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href={`/${lang}/admin/products`} className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-slate-900 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-4xl font-bold font-heading text-slate-900 leading-tight">Bulk Upload</h1>
                    <p className="text-slate-500 font-medium">Add multiple products at once using an Excel or CSV file.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Left: Upload Form */}
                <div className="lg:col-span-3 space-y-8">
                    <form onSubmit={handleUpload} className="bg-white p-10 rounded-3xl border border-slate-100 shadow-sm space-y-8 text-center">
                        <div className="space-y-4">
                            <div className={`mx-auto w-20 h-20 rounded-3xl flex items-center justify-center transition-colors ${file ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-50 text-slate-300'}`}>
                                <FileSpreadsheet className="w-10 h-10" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">{file ? file.name : "Select your file"}</h3>
                                <p className="text-slate-500 text-sm">Supports .xlsx and .csv files</p>
                            </div>
                        </div>

                        <div className="relative group">
                            <input
                                type="file"
                                accept=".xlsx, .csv"
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div className="w-full py-16 border-2 border-dashed border-slate-200 rounded-3xl group-hover:border-rose-400 group-hover:bg-rose-50/50 transition-all flex flex-col items-center justify-center gap-3">
                                <Upload className="w-8 h-8 text-slate-300 group-hover:text-rose-500 transition-colors" />
                                <span className="text-slate-400 font-medium group-hover:text-rose-600 transition-colors">
                                    {file ? "Change File" : "Click to browse or drag file here"}
                                </span>
                            </div>
                        </div>

                        {status.error && (
                            <div className="bg-rose-50 text-rose-700 p-4 rounded-xl flex items-center gap-3 justify-center font-medium text-sm">
                                <AlertCircle className="w-5 h-5 shrink-0" />
                                {status.error}
                            </div>
                        )}

                        {status.success && (
                            <div className="space-y-3">
                                <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl flex items-center gap-3 justify-center font-medium text-sm">
                                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                                    {status.message}
                                </div>
                                {status.details && (
                                    <div className="bg-amber-50 p-4 rounded-xl text-left text-xs space-y-1 max-h-40 overflow-auto">
                                        <p className="font-bold text-amber-700 mb-2">Errors:</p>
                                        {status.details.map((err: any, i: number) => (
                                            <p key={i} className="text-amber-600">
                                                <span className="font-mono font-bold">{err.sku}</span>: {err.error}
                                            </p>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={!file || loading}
                            className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all ${!file || loading
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                : 'bg-rose-700 text-white hover:bg-rose-800 shadow-lg shadow-rose-900/20'
                                }`}
                        >
                            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Upload className="w-6 h-6" />}
                            {loading ? "Importing..." : "Start Import"}
                        </button>
                    </form>

                    {/* Column Reference Table */}
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                        <div className="flex items-center gap-3">
                            <Table2 className="w-5 h-5 text-slate-400" />
                            <h3 className="text-lg font-bold text-slate-900">Required Excel Columns (in order)</h3>
                        </div>

                        <div className="overflow-x-auto rounded-2xl border border-slate-100">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-slate-50 text-left">
                                        <th className="px-4 py-3 font-bold text-slate-500 text-[10px] uppercase tracking-wider">#</th>
                                        <th className="px-4 py-3 font-bold text-slate-500 text-[10px] uppercase tracking-wider">Column Name</th>
                                        <th className="px-4 py-3 font-bold text-slate-500 text-[10px] uppercase tracking-wider">Description</th>
                                        <th className="px-4 py-3 font-bold text-slate-500 text-[10px] uppercase tracking-wider">Example</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {EXCEL_COLUMNS.map((col, i) => (
                                        <tr key={i} className="border-t border-slate-50 hover:bg-slate-50/50 transition-colors">
                                            <td className="px-4 py-3 text-slate-400 font-mono text-xs">{i + 1}</td>
                                            <td className="px-4 py-3 font-bold text-slate-900 text-xs">{col.name}</td>
                                            <td className="px-4 py-3 text-slate-500 text-xs">{col.desc}</td>
                                            <td className="px-4 py-3 text-slate-400 font-mono text-[11px]">{col.example}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-2xl flex gap-3 items-start text-xs text-blue-700">
                            <Info className="w-5 h-5 shrink-0 mt-0.5" />
                            <div className="space-y-1">
                                <p className="font-bold">Multiple variants for the same product?</p>
                                <p className="text-blue-600">Add another row with the same <strong>SKU</strong> but different Color / Sizes. They will be merged as variants of the same product automatically.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right sidebar */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Download Template */}
                    <div className="bg-slate-900 text-white p-8 rounded-3xl space-y-6">
                        <h3 className="text-lg font-bold">Quick Start</h3>
                        <ul className="space-y-4 text-sm text-slate-400">
                            <li className="flex gap-3">
                                <div className="w-5 h-5 rounded-full bg-rose-700 flex items-center justify-center text-[10px] font-bold text-white shrink-0">1</div>
                                Download the CSV template below.
                            </li>
                            <li className="flex gap-3">
                                <div className="w-5 h-5 rounded-full bg-rose-700 flex items-center justify-center text-[10px] font-bold text-white shrink-0">2</div>
                                Fill in your products. Each row = 1 variant.
                            </li>
                            <li className="flex gap-3">
                                <div className="w-5 h-5 rounded-full bg-rose-700 flex items-center justify-center text-[10px] font-bold text-white shrink-0">3</div>
                                Use the same SKU for multiple color variants.
                            </li>
                            <li className="flex gap-3">
                                <div className="w-5 h-5 rounded-full bg-rose-700 flex items-center justify-center text-[10px] font-bold text-white shrink-0">4</div>
                                Upload the file. Images can be added later from the edit page.
                            </li>
                        </ul>
                        <button
                            onClick={handleDownloadTemplate}
                            className="flex items-center justify-center gap-2 w-full py-3 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-100 transition-colors"
                        >
                            <Download className="w-5 h-5" />
                            Download Template
                        </button>
                    </div>

                    {/* Available Categories */}
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Available Categories</h3>
                        <div className="space-y-2 max-h-48 overflow-auto">
                            {categories.length === 0 ? (
                                <p className="text-slate-400 text-sm">No categories found. Add some in the Categories section first.</p>
                            ) : (
                                categories.map(cat => (
                                    <div key={cat.id} className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                                        <span className="text-sm font-medium text-slate-700">{cat.name_en}</span>
                                        <span className="font-mono text-[10px] text-slate-400 bg-white px-2 py-0.5 rounded-full border border-slate-100">{cat.slug}</span>
                                    </div>
                                ))
                            )}
                        </div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                            Use the slug value in the &quot;Category&quot; column
                        </p>
                    </div>

                    {/* Available Colors */}
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Color Reference (Hex Code)</h3>
                        <div className="grid grid-cols-2 gap-2">
                            {PREDEFINED_COLORS.map(color => (
                                <div key={color.hex} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50">
                                    <div
                                        className="w-4 h-4 rounded-full border border-slate-200 shrink-0"
                                        style={{ backgroundColor: color.hex }}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <span className="text-xs font-medium text-slate-700 block truncate">{color.label}</span>
                                        <span className="font-mono text-[9px] text-slate-400">{color.hex}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                            Use hex value (e.g. #000000) in the &quot;Hex Code&quot; column
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
