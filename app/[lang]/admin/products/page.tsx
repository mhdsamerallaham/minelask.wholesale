"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Product } from "@/lib/types";
import Link from "next/link";
import { Plus, Upload, Search, Edit2, Trash2, Eye } from "lucide-react";
import Image from "next/image";

import { use } from "react";

export default function AdminProductsPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = use(params);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        async function fetchProducts() {
            const { data, error } = await supabase
                .from("products")
                .select("*")
                .order("created_at", { ascending: false });

            setProducts(data || []);
            setLoading(false);
        }
        fetchProducts();
    }, []);

    const filteredProducts = products.filter(p =>
        p.name_en.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase())
    );

    const handleDelete = async (product: Product) => {
        if (!confirm(`Are you sure you want to delete "${product.name_en}"?`)) return;

        // If the image is stored in our Supabase storage, try to delete it
        if (product.primary_image_url?.includes('storage/v1/object/public/products')) {
            const path = product.primary_image_url.split('products/').pop();
            if (path) {
                await supabase.storage.from('products').remove([path]);
            }
        }

        const { error } = await supabase.from("products").delete().eq("id", product.id);
        if (!error) {
            setProducts(products.filter(p => p.id !== product.id));
        } else {
            alert("Error deleting product: " + error.message);
        }
    };

    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                    <h1 className="text-4xl font-bold font-heading text-slate-900 leading-tight">Products</h1>
                    <p className="text-slate-500 font-medium">Manage your wholesale collection and stock levels.</p>
                </div>

                <div className="flex items-center gap-4">
                    <Link
                        href={`/${lang}/admin/products/bulk-upload`}
                        className="bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm"
                    >
                        <Upload className="w-5 h-5" />
                        Bulk Upload
                    </Link>
                    <Link
                        href={`/${lang}/admin/products/new`}
                        className="bg-rose-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-rose-800 transition-all shadow-lg shadow-rose-900/20 shadow-sm"
                    >
                        <Plus className="w-5 h-5" />
                        Add Product
                    </Link>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-50 flex items-center gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by name, SKU..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-rose-500/20 outline-none transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                            <tr>
                                <th className="px-8 py-4">Product</th>
                                <th className="px-8 py-4">SKU</th>
                                <th className="px-8 py-4">Price (USD)</th>
                                <th className="px-8 py-4">Stock</th>
                                <th className="px-8 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-12 text-center text-slate-400">Loading products...</td>
                                </tr>
                            ) : filteredProducts.length > 0 ? (
                                filteredProducts.map((product) => (
                                    <tr key={product.id} className="group hover:bg-slate-50 transition-colors">
                                        <td className="px-8 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-16 relative bg-slate-100 rounded-lg overflow-hidden shrink-0">
                                                    {product.primary_image_url && (
                                                        <Image src={product.primary_image_url} alt={product.name_en} fill className="object-cover" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 line-clamp-1">{product.name_en}</p>
                                                    <p className="text-xs text-slate-500">{product.color_name_en}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4 font-mono text-sm text-slate-600">{product.sku}</td>
                                        <td className="px-8 py-4 font-bold text-slate-900">${product.wholesale_price}</td>
                                        <td className="px-8 py-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${(product.stock_qty || 0) > 10 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                                }`}>
                                                {product.stock_qty || 0} in stock
                                            </span>
                                        </td>
                                        <td className="px-8 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link href={`/${lang}/product/${product.id}`} className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                                                    <Eye className="w-5 h-5" />
                                                </Link>
                                                <Link href={`/${lang}/admin/products/${product.id}/edit`} className="p-2 text-slate-400 hover:text-amber-600 transition-colors">
                                                    <Edit2 className="w-5 h-5" />
                                                </Link>
                                                <button onClick={() => handleDelete(product)} className="p-2 text-slate-400 hover:text-rose-600 transition-colors">
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center text-slate-400">No products found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
