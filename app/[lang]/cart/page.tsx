"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getTranslation } from "@/lib/i18n";
import { Trash2, ShoppingBag, ArrowRight, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { use } from "react";

export default function CartPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = use(params);
    const t = (key: string) => getTranslation(lang, key);
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [orderComplete, setOrderComplete] = useState<any>(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        country: ""
    });

    useEffect(() => {
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
            setCartItems(JSON.parse(savedCart));
        }
    }, []);

    const updateQuantity = (id: string, delta: number) => {
        const newItems = cartItems.map(item => {
            if (item.id === id) {
                return { ...item, quantity: Math.max(1, item.quantity + delta) };
            }
            return item;
        });
        setCartItems(newItems);
        localStorage.setItem("cart", JSON.stringify(newItems));
        window.dispatchEvent(new Event("cart-updated"));
    };

    const removeItem = (id: string) => {
        const newItems = cartItems.filter(item => item.id !== id);
        setCartItems(newItems);
        localStorage.setItem("cart", JSON.stringify(newItems));
        window.dispatchEvent(new Event("cart-updated"));
    };

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    // Validation: Check if all items meet their min_order_qty
    const invalidItems = cartItems.filter(item => item.quantity < (item.min_order_qty || 1));
    const isCartValid = invalidItems.length === 0;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isCartValid) return;
        setLoading(true);

        try {
            const response = await fetch("/api/orders/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items: cartItems.map(item => ({
                        id: item.product_id,
                        name: item.name,
                        color: item.color,
                        size: item.size,
                        price: item.price,
                        quantity: item.quantity
                    })),
                    customer: formData
                })
            });

            const result = await response.json();

            if (result.success) {
                setOrderComplete(result);
                localStorage.removeItem("cart");
                window.dispatchEvent(new Event("cart-updated"));
                setCartItems([]);

                // Open WhatsApp fallback
                const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(result.message)}`;
                window.open(whatsappUrl, "_blank");
            } else {
                alert("Checkout failed: " + result.error);
            }
        } catch (err) {
            alert("An error occurred during checkout.");
        } finally {
            setLoading(false);
        }
    };

    if (orderComplete) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="bg-white p-12 rounded-3xl shadow-xl max-w-lg w-full text-center space-y-8">
                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-12 h-12" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold font-heading">{t("cart.order_success_title")}</h2>
                        <p className="text-slate-500">
                            {t("cart.order_success_desc").replace("{number}", orderComplete.order_number)}
                        </p>
                    </div>
                    <Link
                        href={`/${lang}/shop`}
                        className="block w-full py-4 bg-rose-700 text-white rounded-2xl font-bold hover:bg-rose-800 transition-colors"
                    >
                        {t("cart.continue_shopping")}
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar lang={lang} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
                <h1 className="text-4xl font-bold font-heading text-slate-900 mb-12">{t("cart.title")}</h1>

                {cartItems.length === 0 ? (
                    <div className="bg-white p-20 rounded-3xl border border-slate-100 shadow-sm text-center space-y-6">
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-300">
                            <ShoppingBag className="w-10 h-10" />
                        </div>
                        <h3 className="text-xl font-bold">{t("cart.empty")}</h3>
                        <Link href={`/${lang}/shop`} className="inline-block bg-rose-700 text-white px-8 py-3 rounded-full font-bold hover:bg-rose-800 transition-colors">
                            {t("cart.back_to_shop")}
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-2 space-y-6">
                            {cartItems.map((item) => {
                                const isInvalid = item.quantity < (item.min_order_qty || 1);
                                return (
                                    <div key={item.id} className={`bg-white p-6 rounded-3xl border shadow-sm flex gap-6 items-center transition-all ${isInvalid ? 'border-rose-200 ring-2 ring-rose-500/5' : 'border-slate-100'}`}>
                                        <div className="w-24 h-32 relative bg-slate-100 rounded-2xl overflow-hidden shrink-0">
                                            {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" />}
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-lg">{item.name}</h3>
                                                {item.size && (
                                                    <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase">{item.size}</span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full border border-slate-200" style={{ backgroundColor: item.color_hex }} />
                                                <p className="text-sm text-slate-500">{item.color}</p>
                                            </div>

                                            <div className="flex items-center gap-4 pt-2">
                                                <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden shrink-0 bg-white">
                                                    <button onClick={() => updateQuantity(item.id, -1)} className="px-3 py-1 hover:bg-slate-50 font-bold">-</button>
                                                    <span className="px-4 py-1 font-bold min-w-[40px] text-center">{item.quantity}</span>
                                                    <button onClick={() => updateQuantity(item.id, 1)} className="px-3 py-1 hover:bg-slate-50 font-bold">+</button>
                                                </div>
                                                <button onClick={() => removeItem(item.id)} className="text-slate-300 hover:text-rose-500 transition-colors">
                                                    <Trash2 className="w-5 h-5" />
                                                </button>

                                                {isInvalid && (
                                                    <p className="text-[10px] font-bold text-rose-600 uppercase tracking-tight flex items-center gap-1">
                                                        <AlertTriangle className="w-3 h-3" />
                                                        {t("product.min_required").replace("{count}", (item.min_order_qty || 1).toString())}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xl font-bold text-rose-900">${(item.price * item.quantity).toFixed(2)}</p>
                                            <p className="text-xs text-slate-400">${item.price} / each</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <aside className="lg:col-span-1">
                            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6 sticky top-32">
                                <h3 className="text-xl font-bold border-b border-slate-50 pb-4">{t("cart.confirm_order")}</h3>

                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        placeholder={t("cart.customer_name")}
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-rose-500/20 outline-none transition-all"
                                    />
                                    <input
                                        type="tel"
                                        placeholder={t("cart.customer_phone")}
                                        required
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-rose-500/20 outline-none transition-all"
                                    />
                                    <input
                                        type="text"
                                        placeholder={t("cart.customer_country")}
                                        required
                                        value={formData.country}
                                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-rose-500/20 outline-none transition-all"
                                    />
                                </div>

                                <div className="pt-6 border-t border-slate-50 space-y-4">
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-slate-500 text-sm">
                                            <span>{t("cart.subtotal")}</span>
                                            <span>${subtotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-2xl font-bold text-rose-900 pt-2">
                                            <span>{t("cart.total")}</span>
                                            <span>${subtotal.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    {!isCartValid && (
                                        <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl space-y-2">
                                            <div className="flex items-center gap-2 text-rose-700">
                                                <AlertTriangle className="w-5 h-5 shrink-0" />
                                                <p className="font-bold text-sm">{t("warnings.moq_title")}</p>
                                            </div>
                                            <p className="text-xs text-rose-600 leading-relaxed font-medium">
                                                {t("warnings.moq_desc")}
                                            </p>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={loading || !isCartValid}
                                        className="w-full py-5 bg-rose-700 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-rose-800 shadow-xl shadow-rose-900/20 transition-all disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
                                    >
                                        {loading ? <Loader2 className="animate-spin" /> : <ArrowRight className="rtl:rotate-180" />}
                                        {t("cart.confirm_and_whatsapp")}
                                    </button>
                                </div>
                            </form>
                        </aside>
                    </div>
                )}
            </main>

            <Footer lang={lang} />
        </div>
    );
}
