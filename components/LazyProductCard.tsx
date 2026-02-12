"use client";

import dynamic from "next/dynamic";
import { Product } from "@/lib/types";

// Dynamically import ProductCard
const DynamicProductCard = dynamic(
  () => import("./ProductCard").then((mod) => mod.default),
  {
    loading: () => (
      <div className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 animate-pulse">
        <div className="relative aspect-[3/4] overflow-hidden bg-slate-100 mb-4" />
        <div className="p-6 space-y-4">
          <div className="h-6 bg-slate-200 rounded" />
          <div className="h-4 bg-slate-200 rounded w-3/4" />
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="h-8 bg-slate-200 rounded w-20" />
              <div className="h-3 bg-slate-200 rounded w-16" />
            </div>
            <div className="w-12 h-12 bg-slate-200 rounded-xl" />
          </div>
        </div>
      </div>
    ),
  }
);

interface LazyProductCardProps {
  product: Product;
  lang: string;
}

export default function LazyProductCard({ product, lang }: LazyProductCardProps) {
  return <DynamicProductCard product={product} lang={lang} />;
}
