"use client";

import { Product } from "@/lib/types";
import { getTranslation } from "@/lib/i18n";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";

export default function ProductCard({ product, lang }: { product: Product; lang: string }) {
    const t = (key: string) => getTranslation(lang, key);
    const name = lang === 'ar' ? product.name_ar : product.name_en;
    const color = lang === 'ar' ? product.color_name_ar : product.color_name_en;

    return (
        <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-100">
            <Link href={`/${lang}/product/${product.id}`} className="block relative aspect-[3/4] overflow-hidden">
                {product.primary_image_url ? (
                    <Image
                        src={product.primary_image_url}
                        alt={name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">
                        {t("product.no_image")}
                    </div>
                )}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                    {product.stock_qty && product.stock_qty < 5 && (
                        <span className="bg-orange-500 text-white text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider">
                            {t("product.low_stock")}
                        </span>
                    )}
                </div>
            </Link>

            <div className="p-6 space-y-4">
                <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-rose-700 transition-colors line-clamp-1">
                        {name}
                    </h3>
                    <p className="text-sm text-slate-500 flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full border border-slate-200" style={{ backgroundColor: product.color_hex }} />
                        {color}
                    </p>
                </div>

                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <p className="text-2xl font-bold text-rose-900">${product.wholesale_price}</p>
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                            {t("shop.min_order")}: {product.min_order_qty}
                        </p>
                    </div>

                    <button className="bg-slate-900 text-white p-3 rounded-xl hover:bg-rose-700 hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg shadow-slate-900/20 hover:shadow-rose-700/30">
                        <ShoppingCart className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
