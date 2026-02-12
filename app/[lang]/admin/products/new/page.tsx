"use client";

import { use, useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2, Image as ImageIcon, Upload, X, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { Category, ProductVariant } from "@/lib/types";

export default function NewProductPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = use(params);
    const router = useRouter();
    const mainFileInputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);

    // Main Product Image
    const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
    const [mainImageFile, setMainImageFile] = useState<File | null>(null);

    // Variants
    const [variants, setVariants] = useState<ProductVariant[]>([
        { color_en: "", color_ar: "", color_hex: "#000000", sizes: ["36", "38", "40", "42", "44"], image_url: "" }
    ]);
    const [variantFiles, setVariantFiles] = useState<(File | null)[]>([null]);

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
    ];

    const [form, setForm] = useState({
        sku: "",
        name_en: "",
        name_ar: "",
        description_en: "",
        description_ar: "",
        wholesale_price: "",
        min_order_qty: "1",
        stock_qty: "0",
        primary_image_url: "",
        category_slug: ""
    });

    useEffect(() => {
        async function fetchCategories() {
            const { data } = await supabase.from("categories").select("*").eq("is_active", true);
            setCategories(data || []);
        }
        fetchCategories();
    }, []);

    const addVariant = () => {
        setVariants([...variants, { color_en: "", color_ar: "", color_hex: "#000000", sizes: ["36", "38", "40", "42", "44"], image_url: "" }]);
        setVariantFiles([...variantFiles, null]);
    };

    const removeVariant = (index: number) => {
        setVariants(variants.filter((_, i) => i !== index));
        setVariantFiles(variantFiles.filter((_, i) => i !== index));
    };

    const updateVariant = (index: number, field: keyof ProductVariant, value: any) => {
        const newVariants = [...variants];
        newVariants[index] = { ...newVariants[index], [field]: value };
        setVariants(newVariants);
    };

    const handleMainFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setMainImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setMainImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleVariantFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const newFiles = [...variantFiles];
            newFiles[index] = file;
            setVariantFiles(newFiles);

            const reader = new FileReader();
            reader.onloadend = () => {
                const newVariants = [...variants];
                newVariants[index].image_url = reader.result as string; // Temporary preview
                setVariants(newVariants);
            };
            reader.readAsDataURL(file);
        }
    };

    const uploadSingleImage = async (file: File): Promise<string | null> => {
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
            const filePath = `product-images/${fileName}`;

            const { data, error } = await supabase.storage
                .from('products')
                .upload(filePath, file);

            if (error) throw error;

            const { data: { publicUrl } } = supabase.storage
                .from('products')
                .getPublicUrl(filePath);

            return publicUrl;
        } catch (error: any) {
            console.error('Error uploading image:', error.message);
            return null;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Upload Main Image
            let finalMainImageUrl = form.primary_image_url;
            if (mainImageFile) {
                const uploadedUrl = await uploadSingleImage(mainImageFile);
                if (uploadedUrl) finalMainImageUrl = uploadedUrl;
            }

            if (!finalMainImageUrl) {
                alert("Please upload a main product image.");
                setLoading(false);
                return;
            }

            // 2. Upload Variant Images
            const updatedVariants = [...variants];
            for (let i = 0; i < updatedVariants.length; i++) {
                if (variantFiles[i]) {
                    const uploadedUrl = await uploadSingleImage(variantFiles[i]!);
                    if (uploadedUrl) {
                        updatedVariants[i].image_url = uploadedUrl;
                    }
                }
            }

            // 3. Save to Database
            const category = categories.find(c => c.slug === form.category_slug);

            const { error } = await supabase.from("products").insert([
                {
                    sku: form.sku,
                    name_en: form.name_en,
                    name_ar: form.name_ar,
                    description_en: form.description_en,
                    description_ar: form.description_ar,
                    variants: updatedVariants,
                    wholesale_price: parseFloat(form.wholesale_price),
                    min_order_qty: parseInt(form.min_order_qty),
                    stock_qty: 999999, // Production items, no stock limit
                    primary_image_url: finalMainImageUrl,
                    category_id: category?.id,
                    category_slug: form.category_slug,
                    is_active: true
                }
            ]);

            if (!error) {
                router.push(`/${lang}/admin/products`);
            } else {
                alert("Error: " + error.message);
            }
        } catch (err: any) {
            alert("Unexpected error: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-12 pb-20">
            <div className="flex items-center gap-4">
                <Link href={`/${lang}/admin/products`} className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-slate-900 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-4xl font-bold font-heading text-slate-900 leading-tight">Add New Product</h1>
                    <p className="text-slate-500 font-medium">Create a new entry for your wholesale collection.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-8">
                    {/* General Info */}
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                        <h3 className="text-lg font-bold">General Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label htmlFor="name_en" className="text-xs font-bold uppercase tracking-widest text-slate-400">Product Name (EN)</label>
                                <input
                                    id="name_en"
                                    type="text"
                                    required
                                    value={form.name_en}
                                    onChange={(e) => setForm({ ...form, name_en: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-rose-500/20 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="name_ar" className="text-xs font-bold uppercase tracking-widest text-slate-400">Product Name (AR)</label>
                                <input
                                    id="name_ar"
                                    type="text"
                                    required
                                    value={form.name_ar}
                                    onChange={(e) => setForm({ ...form, name_ar: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-rose-500/20 outline-none transition-all text-right"
                                    dir="rtl"
                                />
                            </div>
                            <div className="col-span-1 md:col-span-2 space-y-2">
                                <label htmlFor="description_en" className="text-xs font-bold uppercase tracking-widest text-slate-400">Description (EN)</label>
                                <textarea
                                    id="description_en"
                                    value={form.description_en}
                                    onChange={(e) => setForm({ ...form, description_en: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-rose-500/20 outline-none transition-all min-h-[100px]"
                                />
                            </div>
                            <div className="col-span-1 md:col-span-2 space-y-2">
                                <label htmlFor="description_ar" className="text-xs font-bold uppercase tracking-widest text-slate-400">Description (AR)</label>
                                <textarea
                                    id="description_ar"
                                    value={form.description_ar}
                                    onChange={(e) => setForm({ ...form, description_ar: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-rose-500/20 outline-none transition-all text-right min-h-[100px]"
                                    dir="rtl"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="category" className="text-xs font-bold uppercase tracking-widest text-slate-400">Category</label>
                                <select
                                    id="category"
                                    required
                                    value={form.category_slug}
                                    onChange={(e) => setForm({ ...form, category_slug: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-rose-500/20 outline-none transition-all appearance-none"
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.slug}>{cat.name_en}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="sku" className="text-xs font-bold uppercase tracking-widest text-slate-400">SKU</label>
                                <input
                                    id="sku"
                                    type="text"
                                    required
                                    value={form.sku}
                                    onChange={(e) => setForm({ ...form, sku: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-rose-500/20 outline-none transition-all font-mono"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Variant Section */}
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-8">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold">Color Variants & Media</h3>
                            <button
                                type="button"
                                onClick={addVariant}
                                className="text-rose-600 bg-rose-50 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-rose-100 transition-all"
                            >
                                <Plus className="w-4 h-4" /> Add Color
                            </button>
                        </div>

                        <div className="space-y-10">
                            {variants.map((v, i) => (
                                <div key={i} className="p-8 rounded-3xl bg-slate-50 border border-slate-100 space-y-6 relative group">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {/* Color Details */}
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label htmlFor={`color_en_${i}`} className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Color (EN)</label>
                                                    <input
                                                        id={`color_en_${i}`}
                                                        type="text"
                                                        placeholder="Red"
                                                        required
                                                        value={v.color_en}
                                                        onChange={(e) => updateVariant(i, "color_en", e.target.value)}
                                                        className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl outline-none text-sm"
                                                    />
                                                </div>
                                                <div className="space-y-2 text-right">
                                                    <label htmlFor={`color_ar_${i}`} className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Color (AR)</label>
                                                    <input
                                                        id={`color_ar_${i}`}
                                                        type="text"
                                                        placeholder="أحمر"
                                                        required
                                                        value={v.color_ar}
                                                        onChange={(e) => updateVariant(i, "color_ar", e.target.value)}
                                                        className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl outline-none text-sm text-right"
                                                        dir="rtl"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label htmlFor={`hex_code_${i}`} className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Hex Code</label>
                                                <div className="flex flex-col gap-3">
                                                    <div className="flex gap-2">
                                                        <input
                                                            id={`hex_color_${i}`}
                                                            type="color"
                                                            value={v.color_hex}
                                                            onChange={(e) => updateVariant(i, "color_hex", e.target.value)}
                                                            className="w-10 h-10 border-none p-0 bg-transparent cursor-pointer rounded-lg"
                                                        />
                                                        <input
                                                            id={`hex_code_${i}`}
                                                            type="text"
                                                            value={v.color_hex}
                                                            onChange={(e) => updateVariant(i, "color_hex", e.target.value)}
                                                            className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-xl outline-none text-sm font-mono"
                                                            placeholder="#000000"
                                                        />
                                                    </div>
                                                    <div className="flex flex-wrap gap-1.5 pt-1">
                                                        {PREDEFINED_COLORS.map(color => (
                                                            <button
                                                                key={color.hex}
                                                                type="button"
                                                                onClick={() => updateVariant(i, "color_hex", color.hex)}
                                                                className={`w-6 h-6 rounded-full border border-slate-200 transition-transform hover:scale-110 active:scale-90 shadow-sm ${v.color_hex === color.hex ? 'ring-2 ring-rose-500 ring-offset-1' : ''}`}
                                                                style={{ backgroundColor: color.hex }}
                                                                title={color.label}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label htmlFor={`sizes_${i}`} className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Sizes</label>
                                                <input
                                                    id={`sizes_${i}`}
                                                    type="text"
                                                    placeholder="S, M, L, XL"
                                                    value={v.sizes.join(", ")}
                                                    onChange={(e) => updateVariant(i, "sizes", e.target.value.split(",").map(s => s.trim()).filter(s => s !== ""))}
                                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none text-sm font-bold"
                                                />
                                            </div>
                                        </div>

                                        {/* Variant Image */}
                                        <div className="space-y-2">
                                            <label htmlFor={`variant_file_${i}`} className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Color Photo</label>
                                            <div
                                                onClick={() => document.getElementById(`variant-file-${i}`)?.click()}
                                                className="aspect-square bg-white border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition-all overflow-hidden relative"
                                            >
                                                {v.image_url ? (
                                                    <img src={v.image_url} alt="Variant" className="w-full h-full object-cover" />
                                                ) : (
                                                    <>
                                                        <ImageIcon className="w-8 h-8 text-slate-300" />
                                                        <span className="text-[10px] font-bold text-slate-400 mt-2 text-center px-4 uppercase tracking-tighter">Click to upload color photo</span>
                                                    </>
                                                )}
                                                <input
                                                    id={`variant-file-${i}`}
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={(e) => handleVariantFileChange(i, e)}
                                                    aria-label={`Upload variant ${i + 1} color image`}
                                                />
                                            </div>
                                            <input
                                                id={`variant_image_url_${i}`}
                                                type="url"
                                                placeholder="Or paste Image URL"
                                                value={v.image_url && !v.image_url.startsWith('data:') ? v.image_url : ''}
                                                onChange={(e) => updateVariant(i, "image_url", e.target.value)}
                                                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl outline-none text-[10px] text-slate-500"
                                            />
                                        </div>
                                    </div>

                                    {variants.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeVariant(i)}
                                            className="absolute -top-3 -right-3 w-8 h-8 bg-white text-rose-500 rounded-full border border-slate-100 shadow-lg flex items-center justify-center hover:bg-rose-50 transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Media */}
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                        <h3 className="text-lg font-bold">Main Product Image</h3>
                        <div className="space-y-4">
                            <div
                                onClick={() => mainFileInputRef.current?.click()}
                                className={`aspect-[3/4] bg-slate-50 rounded-2xl border-2 border-dashed ${mainImagePreview ? 'border-rose-500/20' : 'border-slate-200'} flex flex-col items-center justify-center text-slate-400 gap-2 relative overflow-hidden cursor-pointer hover:bg-slate-100 transition-all`}
                            >
                                {mainImagePreview ? (
                                    <>
                                        <img src={mainImagePreview} alt="Preview" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <Upload className="w-8 h-8 text-white" />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <ImageIcon className="w-10 h-10" />
                                        <span className="text-xs font-bold text-center px-4">Click to upload main photo</span>
                                    </>
                                )}
                            </div>
                            <input
                                type="file"
                                ref={mainFileInputRef}
                                onChange={handleMainFileChange}
                                accept="image/*"
                                className="hidden"
                                aria-label="Upload main product image"
                            />

                            <div className="space-y-2">
                                <label htmlFor="primary_image_url" className="text-xs font-bold uppercase tracking-widest text-slate-400">Or Image URL</label>
                                <input
                                    id="primary_image_url"
                                    type="url"
                                    value={form.primary_image_url}
                                    onChange={(e) => {
                                        setForm({ ...form, primary_image_url: e.target.value });
                                        if (e.target.value) setMainImagePreview(e.target.value);
                                    }}
                                    className="w-full px-4 py-2 bg-slate-50 border-none rounded-xl outline-none text-xs text-slate-600"
                                    placeholder="https://..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Logistics */}
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                        <h3 className="text-lg font-bold">Logistics</h3>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label htmlFor="wholesale_price" className="text-xs font-bold uppercase tracking-widest text-slate-400">Wholesale Price (USD)</label>
                                <input
                                    id="wholesale_price"
                                    type="number"
                                    step="0.01"
                                    required
                                    value={form.wholesale_price}
                                    onChange={(e) => setForm({ ...form, wholesale_price: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="min_order_qty" className="text-xs font-bold uppercase tracking-widest text-slate-400">Min. Order Qty</label>
                                <input
                                    id="min_order_qty"
                                    type="number"
                                    required
                                    value={form.min_order_qty}
                                    onChange={(e) => setForm({ ...form, min_order_qty: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-5 bg-slate-900 text-white rounded-3xl font-bold flex items-center justify-center gap-3 hover:bg-slate-800 shadow-xl shadow-slate-900/10 transition-all disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
                        {loading ? "Creating..." : "Create Product"}
                    </button>
                </div>
            </form>
        </div>
    );
}
