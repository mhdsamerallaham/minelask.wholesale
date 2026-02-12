"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Product, ProductVariant } from "@/lib/types";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getTranslation } from "@/lib/i18n";
import Image from "next/image";
import { ShoppingCart, CheckCircle, ArrowLeft, Heart, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use } from "react";

export default function ProductDetailPage({ params }: { params: Promise<{ lang: string; id: string }> }) {
    const { lang, id } = use(params);
    const t = (key: string) => getTranslation(lang, key);
    const router = useRouter();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [selectedColor, setSelectedColor] = useState<ProductVariant | null>(null);
    const [selectedSize, setSelectedSize] = useState<string>("");

    useEffect(() => {
        async function fetchProduct() {
            const { data, error } = await supabase.from("products").select("*").eq("id", id).single();
            if (!error && data) {
                setProduct(data);
                // We won't set defaults to force selection
            }
            setLoading(false);
        }
        fetchProduct();
    }, [id]);

    const addToCart = () => {
        if (!product) return;
        if (!selectedColor || !selectedSize) {
            setError(lang === 'ar' ? "يرجى اختيار اللون والمقاس" : "Please select both color and size");
            setTimeout(() => setError(null), 3000);
            return;
        }

        const cart = JSON.parse(localStorage.getItem("cart") || "[]");

        const colorName = lang === 'ar' ? selectedColor.color_ar : selectedColor.color_en;
        const cartItemId = `${product.id}-${selectedColor.color_en}-${selectedSize}`;

        const existingIndex = cart.findIndex((item: any) => item.id === cartItemId);

        if (existingIndex > -1) {
            cart[existingIndex].quantity += quantity;
        } else {
            cart.push({
                id: cartItemId,
                product_id: product.id,
                name: lang === 'ar' ? product.name_ar : product.name_en,
                color: colorName,
                color_hex: selectedColor.color_hex,
                size: selectedSize,
                price: product.wholesale_price,
                image: selectedColor.image_url || product.primary_image_url,
                quantity: quantity,
                min_order_qty: product.min_order_qty
            });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        window.dispatchEvent(new Event("cart-updated"));
        setAdded(true);
        setTimeout(() => setAdded(false), 3000);
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (!product) return <div className="min-h-screen flex items-center justify-center">Product not found.</div>;

    const name = lang === 'ar' ? product.name_ar : product.name_en;
    const desc = lang === 'ar' ? product.description_ar : product.description_en;

    // Use variant image if selected, otherwise primary product image
    const displayImage = selectedColor?.image_url || product.primary_image_url;

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar lang={lang} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
                <button onClick={() => router.back()} className="mb-8 flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-medium">
                    <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
                    {t("nav.back")}
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Gallery / Product Image */}
                    <div className="space-y-4">
                        <div className="aspect-[3/4] relative bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 transition-all duration-500">
                            {displayImage ? (
                                <Image
                                    key={displayImage} // Force fade animation on change
                                    src={displayImage}
                                    alt={name}
                                    fill
                                    className="object-cover animate-in fade-in duration-500"
                                    priority
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-300">No Image</div>
                            )}
                        </div>
                    </div>

                    {/* Info */}
                    <div className="space-y-10">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <span className="bg-rose-100 text-rose-700 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest leading-none">
                                    {t("landing.new_collection")}
                                </span>
                                <span className="text-slate-400 text-sm font-mono">{product.sku}</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold font-heading text-slate-900 leading-tight">{name}</h1>
                            <div className="flex items-center gap-4">
                                <p className="text-4xl font-bold text-rose-900">${product.wholesale_price}</p>
                                <div className="w-px h-8 bg-slate-200" />
                                <p className="text-slate-500 font-medium">{t("product.wholesale_price_label")}</p>
                            </div>
                        </div>

                        <div className="space-y-8 border-y border-slate-100 py-8">
                            {/* Color Selection */}
                            {product.variants && product.variants.length > 0 && (
                                <div className="space-y-3">
                                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400">{t("product.available_colors")}</p>
                                    <div className="flex flex-wrap gap-3">
                                        {product.variants.map((v, i) => (
                                            <button
                                                key={i}
                                                onClick={() => {
                                                    setSelectedColor(v);
                                                    setSelectedSize(""); // Reset size when color changes
                                                }}
                                                className={`relative w-20 h-24 rounded-2xl border-2 transition-all p-1 overflow-hidden group ${selectedColor?.color_en === v.color_en ? 'border-rose-600 ring-2 ring-rose-500/10 shadow-lg' : 'border-slate-100 bg-white hover:border-slate-300'}`}
                                                title={lang === 'ar' ? v.color_ar : v.color_en}
                                            >
                                                <div className="w-full h-full relative rounded-xl overflow-hidden bg-slate-50">
                                                    {v.image_url ? (
                                                        <Image
                                                            src={v.image_url}
                                                            alt={v.color_en}
                                                            fill
                                                            className="object-cover transition-transform group-hover:scale-110"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: v.color_hex }}>
                                                            <span className="text-[8px] font-bold text-white uppercase mix-blend-difference">
                                                                {lang === 'ar' ? v.color_ar : v.color_en}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                                {/* Color Indicator Dot */}
                                                <div
                                                    className="absolute bottom-2 right-2 w-4 h-4 rounded-full border border-white shadow-sm z-10"
                                                    style={{ backgroundColor: v.color_hex }}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Size Selection */}
                            <div className="space-y-3">
                                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">{t("product.select_size")}</p>
                                <div className="flex flex-wrap gap-2">
                                    {selectedColor ? (
                                        selectedColor.sizes.map((size) => (
                                            <button
                                                key={size}
                                                onClick={() => setSelectedSize(size)}
                                                className={`w-12 h-12 rounded-xl border font-bold text-sm transition-all flex items-center justify-center ${selectedSize === size ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-100 text-slate-600 hover:border-slate-300'}`}
                                            >
                                                {size}
                                            </button>
                                        ))
                                    ) : (
                                        <p className="text-sm text-slate-400 italic">Please select a color first</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">{t("product.min_order_req")}</p>
                                <p className="text-slate-500 text-sm">
                                    {t("product.min_order_help").replace("{count}", product.min_order_qty.toString())}
                                </p>
                            </div>

                            <div className="space-y-4">
                                <p className="text-slate-600 leading-relaxed font-medium">
                                    {desc || "A premium elegant dress designed with high-quality fabrics and attention to detail."}
                                </p>
                            </div>
                        </div>

                        {/* Interaction Bar */}
                        <div className="space-y-6">
                            {error && (
                                <div className="flex items-center gap-2 text-rose-600 bg-rose-50 px-4 py-2 rounded-xl animate-bounce">
                                    <AlertTriangle className="w-4 h-4" />
                                    <span className="text-sm font-bold">{error}</span>
                                </div>
                            )}

                            <div className="flex items-center gap-4">
                                <div className="flex items-center bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-6 py-4 hover:bg-slate-50 transition-colors font-bold text-lg">-</button>
                                    <span className="px-10 py-4 font-bold text-xl">{quantity}</span>
                                    <button onClick={() => setQuantity(quantity + 1)} className="px-6 py-4 hover:bg-slate-50 transition-colors font-bold text-lg">+</button>
                                </div>
                                <button
                                    onClick={addToCart}
                                    className={`flex-1 py-4 px-8 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all ${added ? 'bg-emerald-600 text-white' : 'bg-rose-700 text-white hover:bg-rose-800 shadow-lg shadow-rose-900/20'
                                        }`}
                                >
                                    {added ? <CheckCircle className="w-6 h-6" /> : <ShoppingCart className="w-6 h-6" />}
                                    {added ? t("cart.added_to_cart") : t("shop.add_to_cart")}
                                </button>
                                <button className="p-4 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-rose-500 transition-colors shadow-sm">
                                    <Heart className="w-6 h-6" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer lang={lang} />
        </div>
    );
}
