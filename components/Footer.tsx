import { getTranslation } from "@/lib/i18n";
import Link from "next/link";
import { Instagram, Youtube, Mail, Phone } from "lucide-react";

export default function Footer({ lang }: { lang: string }) {
    const t = (key: string) => getTranslation(lang, key);

    return (
        <footer id="contact" className="bg-black text-white py-16 border-t border-neutral-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
                    <div className="space-y-6 sm:col-span-2 lg:col-span-1">
                        <h3 className="text-xl md:text-2xl font-bold font-heading tracking-wider">
                            <a href="https://minelask.com.tr/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                                MINEL AŞK
                            </a>
                        </h3>
                        <p className="text-neutral-400 max-w-xs leading-relaxed text-sm md:text-base">
                            {t("landing.hero_desc")}
                        </p>
                        <div className="flex space-x-4 rtl:space-x-reverse">
                            <a href="https://www.instagram.com/minelaskofficial/" target="_blank" rel="noopener noreferrer" className="p-3 bg-neutral-900 hover:bg-white hover:text-black transition-all duration-300 border border-neutral-800" aria-label="Instagram">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="https://www.youtube.com/@minelask4832" target="_blank" rel="noopener noreferrer" className="p-3 bg-neutral-900 hover:bg-white hover:text-black transition-all duration-300 border border-neutral-800" aria-label="YouTube">
                                <Youtube className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    <div className="space-y-4 md:space-y-6">
                        <h4 className="text-base md:text-lg font-bold">{t("nav.shop")}</h4>
                        <ul className="space-y-3 md:space-y-4 text-neutral-400 text-sm md:text-base">
                            <li><Link href={`/${lang}/shop`} className="hover:text-white transition-colors block py-1">{t("footer.all_products")}</Link></li>
                            <li><Link href={`/${lang}/shop?sort=new`} className="hover:text-white transition-colors block py-1">{t("footer.new_releases")}</Link></li>
                            <li><Link href={`/${lang}/shop?featured=true`} className="hover:text-white transition-colors block py-1">{t("footer.featured")}</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-4 md:space-y-6">
                        <h4 className="text-base md:text-lg font-bold">{t("footer.services_title")}</h4>
                        <ul className="space-y-3 md:space-y-4 text-neutral-400 text-sm md:text-base">
                            <li className="py-1">{t("landing.wholesale")}</li>
                            <li className="py-1">{t("landing.photography")}</li>
                            <li className="py-1">{t("landing.video")}</li>
                        </ul>
                    </div>

                    <div className="space-y-4 md:space-y-6">
                        <h4 className="text-base md:text-lg font-bold">{t("nav.contact")}</h4>
                        <ul className="space-y-3 md:space-y-4 text-neutral-400 text-sm md:text-base">
                            <li className="flex items-center gap-3 py-1">
                                <Mail className="w-5 h-5 text-white shrink-0" />
                                info@minelask.com
                            </li>
                            <li className="flex items-center gap-3 py-1">
                                <Phone className="w-5 h-5 text-white shrink-0" />
                                +90 555 123 4567
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 md:mt-16 pt-6 md:pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-neutral-300 text-xs md:text-sm">
                    <div>© {new Date().getFullYear()} Minel Aşk. {t("footer.copyright")}</div>
                    <a 
                        href="https://www.samer.life/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-neutral-300 hover:text-white transition-colors"
                    >
                        Made by Samer
                    </a>
                </div>
            </div>
        </footer>
    );
}
