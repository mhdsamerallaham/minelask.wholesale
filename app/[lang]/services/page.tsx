import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getTranslation } from "@/lib/i18n";
import Image from "next/image";
import Link from "next/link";
import { 
    ShoppingBag, 
    Camera, 
    Scissors, 
    Languages, 
    ArrowRight, 
    ArrowDown,
    Sparkles,
    Check,
    Globe,
    Package,
    Clock,
    Award,
    ChevronRight
} from "lucide-react";

export default async function ServicesPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const t = (key: string) => getTranslation(lang, key);

    const services = [
        {
            id: "wholesale",
            number: "01",
            icon: ShoppingBag,
            title: t("services.service1_title"),
            subtitle: t("services.service1_subtitle"),
            description: t("services.service1_desc"),
            features: [
                { title: t("services.service1_feature1"), desc: t("services.service1_feature1_desc") },
                { title: t("services.service1_feature2"), desc: t("services.service1_feature2_desc") },
                { title: t("services.service1_feature3"), desc: t("services.service1_feature3_desc") },
                { title: t("services.service1_feature4"), desc: t("services.service1_feature4_desc") },
            ],
            image: "https://cdn.shopify.com/s/files/1/0579/5325/5592/files/KBRA4274_d3963506-e9a0-47f8-bc1b-18f8ea3ca069.jpg?v=1767898316",
        },
        {
            id: "digital",
            number: "02",
            icon: Camera,
            title: t("services.service2_title"),
            subtitle: t("services.service2_subtitle"),
            description: t("services.service2_desc"),
            features: [
                { title: t("services.service2_feature1"), desc: t("services.service2_feature1_desc") },
                { title: t("services.service2_feature2"), desc: t("services.service2_feature2_desc") },
                { title: t("services.service2_feature3"), desc: t("services.service2_feature3_desc") },
                { title: t("services.service2_feature4"), desc: t("services.service2_feature4_desc") },
            ],
            image: "https://i.pinimg.com/1200x/d5/ec/63/d5ec6342193842498040781531fe5cf7.jpg",
        },
        {
            id: "bespoke",
            number: "03",
            icon: Scissors,
            title: t("services.service3_title"),
            subtitle: t("services.service3_subtitle"),
            description: t("services.service3_desc"),
            features: [
                { title: t("services.service3_feature1"), desc: t("services.service3_feature1_desc") },
                { title: t("services.service3_feature2"), desc: t("services.service3_feature2_desc") },
                { title: t("services.service3_feature3"), desc: t("services.service3_feature3_desc") },
                { title: t("services.service3_feature4"), desc: t("services.service3_feature4_desc") },
            ],
            image: "https://i.pinimg.com/736x/9b/43/0b/9b430bbe1d780347ffe46ba508bd54a1.jpg",
        },
        {
            id: "global",
            number: "04",
            icon: Languages,
            title: t("services.service4_title"),
            subtitle: t("services.service4_subtitle"),
            description: t("services.service4_desc"),
            features: [
                { title: t("services.service4_feature1"), desc: t("services.service4_feature1_desc") },
                { title: t("services.service4_feature2"), desc: t("services.service4_feature2_desc") },
                { title: t("services.service4_feature3"), desc: t("services.service4_feature3_desc") },
                { title: t("services.service4_feature4"), desc: t("services.service4_feature4_desc") },
            ],
            image: "https://i.pinimg.com/1200x/32/98/04/3298048c71e12034d36bf4bcdcec787c.jpg",
        },
    ];

    const benefits = [
        { icon: Award, title: t("services.benefit1_title"), desc: t("services.benefit1_desc") },
        { icon: Clock, title: t("services.benefit2_title"), desc: t("services.benefit2_desc") },
        { icon: Globe, title: t("services.benefit3_title"), desc: t("services.benefit3_desc") },
    ];

    const process = [
        { number: "01", title: t("services.process_step1"), desc: t("services.process_step1_desc") },
        { number: "02", title: t("services.process_step2"), desc: t("services.process_step2_desc") },
        { number: "03", title: t("services.process_step3"), desc: t("services.process_step3_desc") },
        { number: "04", title: t("services.process_step4"), desc: t("services.process_step4_desc") },
    ];

    return (
        <div className="min-h-screen bg-white">
            <Navbar lang={lang} />

            <main>
                {/* Hero Section - Full Height */}
                <section className="relative min-h-screen flex items-center text-white overflow-hidden">
                    {/* Background Image */}
                    <div className="absolute inset-0 z-0">
                        <Image
                            src="https://i.pinimg.com/1200x/bf/d5/68/bfd56848caf4671476205527599c279f.jpg"
                            alt="Hero Background"
                            fill
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 bg-black/60" />
                    </div>
                    
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-neutral-800 to-transparent rounded-full blur-3xl opacity-30 translate-x-1/2 -translate-y-1/2 z-10" />
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-neutral-800 to-transparent rounded-full blur-3xl opacity-20 -translate-x-1/2 translate-y-1/2 z-10" />

                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 w-full">
                        <div className="max-w-4xl">
                            {/* Subtitle */}
                            <div className="flex items-center gap-4 mb-8">
                                <div className="h-[1px] w-16 bg-white/40" />
                                <span className="text-sm uppercase tracking-[0.3em] text-white/60 font-medium">
                                    {t("services.hero_subtitle")}
                                </span>
                            </div>
                            
                            {/* Title */}
                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-[0.9] tracking-tight">
                                {t("services.hero_title")}
                            </h1>
                            
                            {/* Description */}
                            <p className="text-xl md:text-2xl text-white/70 max-w-2xl leading-relaxed mb-12 font-light">
                                {t("services.hero_desc")}
                            </p>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    href={`/${lang}/shop`}
                                    className="inline-flex items-center justify-center gap-3 bg-white text-black px-8 py-4 text-sm font-bold uppercase tracking-wider hover:bg-neutral-200 transition-colors"
                                >
                                    {t("services.cta_button_secondary")}
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                                <a
                                    href="https://wa.me/905551234567"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-3 border border-white/30 text-white px-8 py-4 text-sm font-bold uppercase tracking-wider hover:bg-white/10 transition-colors"
                                >
                                    {t("services.cta_button_primary")}
                                </a>
                            </div>
                        </div>

                        {/* Stats Row */}
                        <div className="absolute bottom-0 left-0 right-0 border-t border-white/10">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
                                    {[
                                        { value: "1000+", label: "Products" },
                                        { value: "50+", label: "Countries" },
                                        { value: "10K+", label: "Photos" },
                                        { value: "500+", label: "Partners" },
                                    ].map((stat, idx) => (
                                        <div key={idx} className="py-8 border-r border-white/10 last:border-r-0 text-center md:text-left">
                                            <div className="text-3xl md:text-4xl font-bold mb-1">{stat.value}</div>
                                            <div className="text-sm text-white/50 uppercase tracking-wider">{stat.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Scroll Indicator */}
                    <div className="absolute bottom-32 right-8 hidden lg:flex flex-col items-center gap-2 text-white/40">
                        <span className="text-xs uppercase tracking-widest rotate-90 origin-center translate-y-8">{t("services.scroll_explore")}</span>
                        <ArrowDown className="w-4 h-4 animate-bounce" />
                    </div>
                </section>

                {/* Services Detail Sections */}
                {services.map((service, index) => (
                    <section 
                        key={service.id} 
                        className={`py-24 md:py-32 ${index % 2 === 0 ? 'bg-white' : 'bg-neutral-50'}`}
                    >
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center`}>
                                {/* Content */}
                                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                                    {/* Service Number & Icon */}
                                    <div className="flex items-center gap-4 mb-6">
                                        <span className="text-6xl font-bold text-neutral-200">{service.number}</span>
                                        <div className="w-14 h-14 bg-black text-white flex items-center justify-center">
                                            <service.icon className="w-6 h-6" />
                                        </div>
                                    </div>

                                    {/* Subtitle */}
                                    <span className="text-sm uppercase tracking-[0.2em] text-neutral-500 font-medium mb-4 block">
                                        {service.subtitle}
                                    </span>

                                    {/* Title */}
                                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                                        {service.title}
                                    </h2>

                                    {/* Description */}
                                    <p className="text-lg text-neutral-600 leading-relaxed mb-10">
                                        {service.description}
                                    </p>

                                    {/* Features Grid */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                                        {service.features.map((feature, fidx) => (
                                            <div key={fidx} className="group">
                                                <div className="flex items-start gap-3 mb-2">
                                                    <div className="w-5 h-5 rounded-full border border-black flex items-center justify-center mt-0.5 group-hover:bg-black group-hover:text-white transition-colors">
                                                        <Check className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    </div>
                                                    <h3 className="font-bold text-sm uppercase tracking-wide">{feature.title}</h3>
                                                </div>
                                                <p className="text-sm text-neutral-500 leading-relaxed pl-8">
                                                    {feature.desc}
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* CTA */}
                                    <Link
                                        href={`/${lang}/shop`}
                                        className="inline-flex items-center gap-2 text-black font-bold text-sm uppercase tracking-wider group"
                                    >
                                        {t("landing.start_shopping")}
                                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>

                                {/* Image */}
                                <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                                    <div className="relative aspect-[4/5] overflow-hidden group">
                                        <Image
                                            src={service.image}
                                            alt={service.title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                ))}

                {/* Why Choose Us - Full Width Black */}
                <section className="py-24 md:py-32 bg-black text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Header */}
                        <div className="text-center mb-20">
                            <span className="text-sm uppercase tracking-[0.3em] text-white/50 mb-4 block">
                                {t("services.why_choose_subtitle")}
                            </span>
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                                {t("services.why_choose_title")}
                            </h2>
                        </div>

                        {/* Benefits Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
                            {benefits.map((benefit, idx) => (
                                <div key={idx} className="text-center group">
                                    <div className="w-20 h-20 mx-auto mb-6 border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-300">
                                        <benefit.icon className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-4">{benefit.title}</h3>
                                    <p className="text-white/60 leading-relaxed max-w-xs mx-auto">
                                        {benefit.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Process Section */}
                <section className="py-24 md:py-32 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Header */}
                        <div className="text-center mb-20">
                            <h2 className="text-4xl md:text-5xl font-bold mb-4">{t("services.process_title")}</h2>
                            <div className="h-[2px] w-24 bg-black mx-auto" />
                        </div>

                        {/* Process Steps */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            {process.map((step, idx) => (
                                <div key={idx} className="relative">
                                    <div className="text-6xl font-bold text-neutral-100 mb-4">{step.number}</div>
                                    <h3 className="text-xl font-bold mb-3 -mt-8 relative z-10">{step.title}</h3>
                                    <p className="text-neutral-500 leading-relaxed text-sm">
                                        {step.desc}
                                    </p>
                                    {idx < 3 && (
                                        <div className="hidden md:block absolute top-12 left-full w-full h-[1px] bg-neutral-200">
                                            <ArrowRight className="absolute right-0 -top-2 w-4 h-4 text-neutral-300" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="py-24 md:py-32 bg-neutral-900 text-white">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <Sparkles className="w-12 h-12 mx-auto mb-8 text-white/40" />
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                            {t("services.cta_title")}
                        </h2>
                        <p className="text-xl text-white/60 mb-12 max-w-2xl mx-auto leading-relaxed">
                            {t("services.cta_desc")}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="https://wa.me/905551234567"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-3 bg-white text-black px-10 py-5 text-sm font-bold uppercase tracking-wider hover:bg-neutral-200 transition-colors"
                            >
                                {t("services.cta_button_primary")}
                            </a>
                            <Link
                                href={`/${lang}/shop`}
                                className="inline-flex items-center justify-center gap-3 border border-white/30 text-white px-10 py-5 text-sm font-bold uppercase tracking-wider hover:bg-white/10 transition-colors"
                            >
                                {t("services.cta_button_secondary")}
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <Footer lang={lang} />
        </div>
    );
}
