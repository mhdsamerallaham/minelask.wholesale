"use client";

import { lazy, Suspense } from "react";
import { Canvas } from "@react-three/fiber";

// Lazy load heavy Three.js components
const SceneContent = lazy(() => import("./SceneContent"));

// Loading fallback
const LoadingFallback = () => (
  <div className="absolute inset-0 w-full h-full bg-black flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
  </div>
);

export default function HeroScene() {
    return (
        <div className="absolute inset-0 w-full h-full bg-black">
            <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
                <Suspense fallback={null}>
                    <SceneContent />
                </Suspense>
                <ambientLight intensity={1} />
            </Canvas>
            {/* Overlay gradient to match previous design */}
            <div className="absolute inset-0 bg-black/40 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />
        </div>
    );
}
