"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getTranslation } from "@/lib/i18n";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star, Camera, Video, ShoppingBag, Scissors, Package, Smartphone } from "lucide-react";
import { useEffect, useRef } from "react";

export default function LandingPage({ params }: { params: { lang: string } }) {
    const { lang } = params;
    const t = (key: string) => getTranslation(lang, key);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const video = videoRef.current;
        if (video) {
            video.addEventListener('loadstart', () => console.log('Video loading started'));
            video.addEventListener('canplay', () => console.log('Video can play'));
            video.addEventListener('error', (e) => console.log('Video error:', e));
        }
    }, []);

    const featuredProducts = [
        { id: 1, img: "/images/KBRA3911.jpg", title: "Evening Wear" },
        { id: 2, img: "/images/KBRA4052.jpg", title: "Modest Collection" },
        { id: 3, img: "/images/KBRA4274.jpg", title: "Luxury Fabrics" },
        { id: 4, img: "/images/KBRA4346.jpg", title: "New Season" },
    ];

    return (
        <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
            <Navbar lang={lang} />

            <main>
                {/* Hero Section */}
                <section className="relative h-screen flex items-center overflow-hidden">
                    {/* Hero Video Background */}
                    <div className="absolute inset-0 z-0">
                        <video
                            ref={videoRef}
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="absolute inset-0 w-full h-full object-cover"
                            poster="/images/hero.png"
                        >
                            <source src="/hero.mp4" type="video/mp4" />
                        </video>
                        {/* Overlay for text readability */}
                        <div className="absolute inset-0 bg-black/40" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                    </div>

                    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-20">
                        <div className="max-w-3xl space-y-8">
                            <h1 className="text-5xl md:text-8xl font-bold font-heading text-white leading-tight tracking-tight">
                                {t("landing.hero_title")}
                            </h1>
                            <p className="text-xl md:text-2xl text-neutral-200 font-light max-w-xl leading-relaxed">
                                {t("landing.hero_desc")}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-6 pt-4">
                                <Link
                                    href={`/${lang}/shop`}
                                    className="bg-white text-black px-10 py-5 rounded-none font-bold text-lg flex items-center justify-center gap-3 transition-transform hover:-translate-y-1 hover:shadow-lg active:scale-95 tracking-wide"
                                >
                                    {t("landing.start_shopping")}
                                    <ArrowRight className="w-5 h-5 rtl:rotate-180" />
                                </Link>
                                <Link
                                    href="#services"
                                    className="bg-transparent border border-white text-white px-10 py-5 rounded-none font-bold text-lg flex items-center justify-center gap-3 transition-colors hover:bg-white hover:text-black tracking-wide"
                                >
                                    {t("landing.learn_more")}
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Trust Indicators / Stats */}
                <section className="bg-black text-white py-12 border-b border-neutral-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-neutral-800 rtl:divide-x-reverse">
                            <div className="p-4">
                                <div className="text-3xl font-bold font-heading mb-1">50+</div>
                                <div className="text-sm text-neutral-400 uppercase tracking-widest">{t("landing.stats_countries")}</div>
                            </div>
                            <div className="p-4">
                                <div className="text-3xl font-bold font-heading mb-1">1000+</div>
                                <div className="text-sm text-neutral-400 uppercase tracking-widest">{t("landing.stats_retailers")}</div>
                            </div>
                            <div className="p-4">
                                <div className="text-3xl font-bold font-heading mb-1">24/7</div>
                                <div className="text-sm text-neutral-400 uppercase tracking-widest">{t("landing.stats_support")}</div>
                            </div>
                            <div className="p-4">
                                <div className="text-3xl font-bold font-heading mb-1">100%</div>
                                <div className="text-sm text-neutral-400 uppercase tracking-widest">{t("landing.stats_quality")}</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Featured Collection */}
                <section className="py-24 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-end mb-12">
                            <div>
                                <h2 className="text-4xl font-bold font-heading mb-4">{t("landing.latest_collections")}</h2>
                                <p className="text-neutral-500 max-w-md">{t("landing.collections_desc")}</p>
                            </div>
                            <Link href={`/${lang}/shop`} className="hidden md:flex items-center gap-2 text-black font-bold hover:text-neutral-700 hover:underline underline-offset-4 transition-colors">
                                {t("landing.view_all")} <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {featuredProducts.map((product) => (
                                <Link href={`/${lang}/shop`} key={product.id} className="group cursor-pointer">
                                    <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100 mb-4">
                                        <Image
                                            src={product.img}
                                            alt={product.title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                            quality={75}
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                    </div>
                                    <h3 className="text-lg font-bold group-hover:text-neutral-600 transition-colors">{product.title}</h3>
                                    <span className="text-sm text-neutral-600 uppercase tracking-wider">{t("landing.wholesale_only")}</span>
                                </Link>
                            ))}
                        </div>
                        <div className="mt-12 text-center md:hidden">
                            <Link href={`/${lang}/shop`} className="inline-block border border-black text-black px-8 py-3 font-bold uppercase tracking-wider transition-colors hover:bg-black hover:text-white">
                                {t("landing.view_all_collections")}
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Why Choose Us */}
                <section className="py-24 bg-neutral-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold font-heading mb-6">{t("landing.why_us")}</h2>
                            <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
                                {t("landing.why_us_desc")}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            <div className="group p-8 bg-white border border-neutral-100 hover:border-neutral-300 hover:shadow-xl transition-all duration-300">
                                <div className="w-16 h-16 bg-black text-white flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                                    <Scissors className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold mb-4">{t("landing.service_1_title")}</h3>
                                <p className="text-neutral-500 leading-relaxed">{t("landing.service_1_desc")}</p>
                            </div>

                            <div className="group p-8 bg-white border border-neutral-100 hover:border-neutral-300 hover:shadow-xl transition-all duration-300">
                                <div className="w-16 h-16 bg-black text-white flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                                    <Package className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold mb-4">{t("landing.service_2_title")}</h3>
                                <p className="text-neutral-500 leading-relaxed">{t("landing.service_2_desc")}</p>
                            </div>

                            <div className="group p-8 bg-white border border-neutral-100 hover:border-neutral-300 hover:shadow-xl transition-all duration-300">
                                <div className="w-16 h-16 bg-black text-white flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                                    <Smartphone className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold mb-4">{t("landing.service_3_title")}</h3>
                                <p className="text-neutral-500 leading-relaxed">{t("landing.service_3_desc")}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Services Section */}
                <section id="services" className="py-24 bg-black text-white overflow-hidden relative">
                    <div className="absolute right-0 top-0 w-1/2 h-full hidden lg:block opacity-60">
                        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black z-10" />
                        <Image
                            src="/images/service.png"
                            alt="Photography Service"
                            fill
                            className="object-cover"
                            sizes="50vw"
                            quality={75}
                            loading="lazy"
                        />
                    </div>

                    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="lg:w-1/2">
                            <span className="text-neutral-400 font-bold tracking-widest uppercase mb-2 block">{t("landing.our_expertise")}</span>
                            <h2 className="text-4xl md:text-5xl font-bold font-heading mb-12 leading-tight">{t("landing.services_title")}</h2>

                            <div className="space-y-12">
                                <div className="flex gap-6">
                                    <div className="w-12 h-12 border border-white/20 flex items-center justify-center shrink-0">
                                        <Star className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2">{t("landing.wholesale")}</h3>
                                        <p className="text-neutral-400 leading-relaxed">{t("landing.wholesale_desc")}</p>
                                    </div>
                                </div>

                                <div className="flex gap-6">
                                    <div className="w-12 h-12 border border-white/20 flex items-center justify-center shrink-0">
                                        <Camera className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2">{t("landing.photography")}</h3>
                                        <p className="text-neutral-400 leading-relaxed">{t("landing.photography_desc")}</p>
                                    </div>
                                </div>

                                <div className="flex gap-6">
                                    <div className="w-12 h-12 border border-white/20 flex items-center justify-center shrink-0">
                                        <Video className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2">{t("landing.video")}</h3>
                                        <p className="text-neutral-400 leading-relaxed">{t("landing.video_desc")}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-32 bg-white text-black text-center border-t border-neutral-100">
                    <div className="max-w-4xl mx-auto px-4">
                        <h2 className="text-5xl font-bold font-heading mb-8">{t("landing.cta_title")}</h2>
                        <p className="text-xl text-neutral-500 mb-12 max-w-2xl mx-auto">{t("landing.cta_desc")}</p>
                        <Link
                            href={`/${lang}/shop`}
                            className="inline-block bg-black text-white px-12 py-5 font-bold text-lg hover:bg-neutral-800 transition-colors uppercase tracking-widest"
                        >
                            {t("landing.cta_button")}
                        </Link>
                    </div>
                </section>
            </main>

            <Footer lang={lang} />
        </div>
    );
}
