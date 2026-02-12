"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

// Loading fallback
const LoadingFallback = () => (
  <div className="absolute inset-0 w-full h-full bg-black flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
  </div>
);

// Dynamically import HeroScene with no SSR
const DynamicHeroScene = dynamic(
  () => import("./HeroScene").then((mod) => mod.default),
  {
    ssr: false,
    loading: LoadingFallback,
  }
);

export default function LazyHeroScene() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <DynamicHeroScene />
    </Suspense>
  );
}
