import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getTranslation } from "@/lib/i18n";
import Link from "next/link";
import { 
    MessageCircle, 
    MapPin, 
    Instagram, 
    Youtube, 
    ArrowRight, 
    ArrowUpRight,
    Sparkles,
    Clock,
    Globe
} from "lucide-react";

export default async function ContactPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const t = (key: string) => getTranslation(lang, key);

    const whatsappNumber = "009055497113224";
    const whatsappLink = `https://wa.me/${whatsappNumber}`;
    const locationLink = "https://maps.app.goo.gl/f61ewsdyjy4YpB9o9";
    const instagramLink = "https://www.instagram.com/minelaskofficial/";
    const youtubeLink = "https://www.youtube.com/@minelask4832";

    return (
        <div className="min-h-screen bg-white">
            <Navbar lang={lang} />

            <main>
                {/* Hero Section */}
                <section className="relative min-h-[70vh] flex items-center bg-black text-white overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-5">
                        <div className="absolute inset-0" style={{
                            backgroundImage: `linear-gradient(90deg, white 1px, transparent 1px), linear-gradient(white 1px, transparent 1px)`,
                            backgroundSize: '100px 100px'
                        }} />
                    </div>
                    
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-neutral-800 to-transparent rounded-full blur-3xl opacity-30 translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-gradient-to-tr from-neutral-800 to-transparent rounded-full blur-3xl opacity-20 -translate-x-1/2 translate-y-1/2" />

                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 w-full">
                        <div className="max-w-4xl">
                            {/* Subtitle */}
                            <div className="flex items-center gap-4 mb-8">
                                <div className="h-[1px] w-16 bg-white/40" />
                                <span className="text-sm uppercase tracking-[0.3em] text-white/60 font-medium">
                                    {t("contact.hero_subtitle")}
                                </span>
                            </div>
                            
                            {/* Title */}
                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-[0.9] tracking-tight">
                                {t("contact.hero_title")}
                            </h1>
                            
                            {/* Description */}
                            <p className="text-xl md:text-2xl text-white/70 max-w-2xl leading-relaxed mb-12 font-light">
                                {t("contact.hero_desc")}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Contact Cards Section */}
                <section className="py-24 md:py-32 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                            
                            {/* WhatsApp Card */}
                            <div className="group relative bg-neutral-50 p-10 lg:p-12 hover:bg-neutral-100 transition-colors duration-500">
                                <div className="relative">
                                    <div className="w-16 h-16 bg-black text-white flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                                        <MessageCircle className="w-8 h-8" />
                                    </div>
                                    
                                    <h3 className="text-2xl md:text-3xl font-bold mb-4">{t("contact.whatsapp_title")}</h3>
                                    <p className="text-neutral-600 leading-relaxed mb-8">
                                        {t("contact.whatsapp_desc")}
                                    </p>
                                    
                                    <div className="flex items-center gap-4 mb-8">
                                        <Clock className="w-5 h-5 text-neutral-400" />
                                        <span className="text-sm text-neutral-500">{t("contact.whatsapp_hours")}</span>
                                    </div>
                                    
                                    <a
                                        href={whatsappLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-3 bg-black text-white px-8 py-4 text-sm font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors group/btn"
                                    >
                                        {t("contact.whatsapp_button")}
                                        <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                    </a>
                                </div>
                            </div>

                            {/* Location Card */}
                            <div className="group relative bg-neutral-50 p-10 lg:p-12 hover:bg-neutral-100 transition-colors duration-500">
                                <div className="relative">
                                    <div className="w-16 h-16 bg-black text-white flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                                        <MapPin className="w-8 h-8" />
                                    </div>
                                    
                                    <h3 className="text-2xl md:text-3xl font-bold mb-4">{t("contact.location_title")}</h3>
                                    <p className="text-neutral-600 leading-relaxed mb-8">
                                        {t("contact.location_desc")}
                                    </p>
                                    
                                    <div className="flex items-center gap-4 mb-8">
                                        <Globe className="w-5 h-5 text-neutral-400" />
                                        <span className="text-sm text-neutral-500">{t("contact.location_address")}</span>
                                    </div>
                                    
                                    <a
                                        href={locationLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-3 bg-black text-white px-8 py-4 text-sm font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors group/btn"
                                    >
                                        {t("contact.location_button")}
                                        <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Social Media Section */}
                <section className="py-24 md:py-32 bg-black text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <span className="text-sm uppercase tracking-[0.3em] text-white/50 mb-4 block">
                                @minelaskofficial
                            </span>
                            <h2 className="text-4xl md:text-5xl font-bold mb-6">
                                {t("contact.social_title")}
                            </h2>
                            <p className="text-xl text-white/60 max-w-2xl mx-auto">
                                {t("contact.social_desc")}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                            {/* Instagram */}
                            <a
                                href={instagramLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center gap-6 p-8 border border-white/20 hover:bg-white hover:text-black transition-all duration-300"
                            >
                                <div className="w-16 h-16 bg-white text-black flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all duration-300">
                                    <Instagram className="w-8 h-8" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-xl font-bold mb-1">Instagram</h4>
                                    <p className="text-sm text-white/50 group-hover:text-neutral-500">@minelaskofficial</p>
                                </div>
                                <ArrowUpRight className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </a>

                            {/* YouTube */}
                            <a
                                href={youtubeLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center gap-6 p-8 border border-white/20 hover:bg-white hover:text-black transition-all duration-300"
                            >
                                <div className="w-16 h-16 bg-white text-black flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all duration-300">
                                    <Youtube className="w-8 h-8" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-xl font-bold mb-1">YouTube</h4>
                                    <p className="text-sm text-white/50 group-hover:text-neutral-500">@minelask4832</p>
                                </div>
                                <ArrowUpRight className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </a>
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="py-24 md:py-32 bg-neutral-50">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                            {t("contact.cta_headline")}
                        </h2>
                        <p className="text-xl text-neutral-500 mb-12 max-w-2xl mx-auto leading-relaxed">
                            {t("contact.cta_text")}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href={whatsappLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-3 bg-black text-white px-10 py-5 text-sm font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors"
                            >
                                {t("contact.cta_whatsapp")}
                                <ArrowRight className="w-4 h-4" />
                            </a>
                            <a
                                href={locationLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-3 border border-black px-10 py-5 text-sm font-bold uppercase tracking-wider hover:bg-black hover:text-white transition-colors"
                            >
                                {t("contact.cta_location")}
                            </a>
                        </div>
                    </div>
                </section>
            </main>

            <Footer lang={lang} />
        </div>
    );
}
