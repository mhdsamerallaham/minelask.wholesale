"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Product, Category } from "@/lib/types";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { getTranslation } from "@/lib/i18n";
import { Search, Filter, SlidersHorizontal } from "lucide-react";

import { use } from "react";

export default function ShopPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = use(params);
    const t = (key: string) => getTranslation(lang, key);
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");

    useEffect(() => {
        async function fetchData() {
            // Fetch categories
            const { data: catData } = await supabase
                .from("categories")
                .select("*")
                .eq("is_active", true)
                .order("display_order", { ascending: true });

            setCategories(catData || []);

            // Fetch products
            let query = supabase.from("products").select("*").eq("is_active", true);

            if (selectedCategory !== "all") {
                query = query.eq("category_slug", selectedCategory);
            }

            const { data: prodData } = await query.order("created_at", { ascending: false });
            setProducts(prodData || []);
            setLoading(false);
        }

        fetchData();
    }, [selectedCategory]);

    const filteredProducts = products.filter(p =>
        p.name_en.toLowerCase().includes(search.toLowerCase()) ||
        p.name_ar.includes(search) ||
        p.sku.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar lang={lang} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 space-y-8 md:space-y-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-5xl font-bold font-heading text-slate-900 leading-tight">
                            {t("shop.title")}
                        </h1>
                        <p className="text-slate-500 font-medium">{t("shop.explore_desc")}</p>
                    </div>

                    <div className="flex flex-wrap gap-4 items-center">
                        <div className="relative group w-full sm:w-auto sm:min-w-[300px]">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-rose-700 transition-colors" />
                            <input
                                type="text"
                                placeholder={t("shop.search_placeholder")}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all shadow-sm"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                    {/* Sidebar - Mobile Horizontal Scroll */}
                    <aside className="lg:w-64 space-y-8">
                        <div className="space-y-4 lg:space-y-6">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2 hidden lg:flex">
                                <Filter className="w-4 h-4" />
                                {t("shop.filter_category")}
                            </h3>
                            {/* Mobile: Horizontal scroll categories */}
                            <div className="flex lg:hidden gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
                                <button
                                    onClick={() => setSelectedCategory("all")}
                                    className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all flex-shrink-0 ${selectedCategory === 'all'
                                        ? 'bg-black text-white'
                                        : 'bg-white text-slate-600 border border-slate-200'
                                        }`}
                                >
                                    {t("shop.all_categories")}
                                </button>
                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setSelectedCategory(cat.slug)}
                                        className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all flex-shrink-0 ${selectedCategory === cat.slug
                                            ? 'bg-black text-white'
                                            : 'bg-white text-slate-600 border border-slate-200'
                                            }`}
                                    >
                                        {lang === 'ar' ? cat.name_ar : cat.name_en}
                                    </button>
                                ))}
                            </div>
                            {/* Desktop: Vertical list */}
                            <div className="hidden lg:block space-y-2">
                                <button
                                    onClick={() => setSelectedCategory("all")}
                                    className={`w-full text-left px-4 py-2 rounded-xl transition-all ${selectedCategory === 'all'
                                        ? 'bg-rose-700 text-white font-bold shadow-lg shadow-rose-900/20'
                                        : 'text-slate-600 hover:bg-white hover:shadow-sm'
                                        }`}
                                >
                                    {t("shop.all_categories")}
                                </button>
                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setSelectedCategory(cat.slug)}
                                        className={`w-full text-left px-4 py-2 rounded-xl transition-all ${selectedCategory === cat.slug
                                            ? 'bg-rose-700 text-white font-bold shadow-lg shadow-rose-900/20'
                                            : 'text-slate-600 hover:bg-white hover:shadow-sm'
                                            }`}
                                    >
                                        {lang === 'ar' ? cat.name_ar : cat.name_en}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* Main Grid */}
                    <div className="flex-1">
                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                                {[1, 2, 3, 4, 5, 6].map((n) => (
                                    <div key={n} className="h-80 sm:h-96 bg-slate-200 animate-pulse rounded-xl" />
                                ))}
                            </div>
                        ) : filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                                {filteredProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} lang={lang} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 sm:py-20 space-y-4">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                                    <SlidersHorizontal className="w-8 h-8 sm:w-10 sm:h-10 text-slate-300" />
                                </div>
                                <h3 className="text-lg sm:text-xl font-bold text-slate-900">{t("shop.no_products")}</h3>
                                <p className="text-slate-500 text-sm sm:text-base">{t("shop.no_products_desc")}</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer lang={lang} />
        </div>
    );
}
