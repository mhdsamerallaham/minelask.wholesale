"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getTranslation } from "@/lib/i18n";
import { Globe, ShoppingCart, User, Instagram, Youtube, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

export default function Navbar({ lang }: { lang: string }) {
    const t = (key: string) => getTranslation(lang, key);
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);

    const updateCartCount = () => {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        const count = cart.reduce((acc: number, item: any) => acc + item.quantity, 0);
        setCartCount(count);
    };

    useEffect(() => {
        updateCartCount();
        window.addEventListener("cart-updated", updateCartCount);
        window.addEventListener("storage", updateCartCount);
        return () => {
            window.removeEventListener("cart-updated", updateCartCount);
            window.removeEventListener("storage", updateCartCount);
        };
    }, []);

    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname]);

    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isMenuOpen]);

    const toggleLang = () => {
        const newLang = lang === "en" ? "ar" : "en";
        const newPath = pathname.replace(`/${lang}`, `/${newLang}`);
        return newPath;
    };

    const navLinks = [
        { href: `/${lang}`, label: t("nav.home") },
        { href: `/${lang}/shop`, label: t("nav.shop") },
        { href: `/${lang}/services`, label: t("nav.services") },
        { href: `/${lang}/contact`, label: t("nav.contact") },
    ];

    return (
        <>
            <nav className="fixed w-full z-50 bg-white/95 backdrop-blur-md border-b border-neutral-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 md:h-20 items-center">
                        <div className="flex items-center">
                            <Link href={`/${lang}`} className="relative h-10 md:h-12 w-32 md:w-40">
                                <img
                                    src="/images/logo.png"
                                    alt="MINEL AŞK"
                                    className="h-full w-full object-contain object-left"
                                />
                            </Link>
                        </div>

                        <div className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="text-neutral-600 hover:text-black transition-colors font-medium relative group py-2"
                                >
                                    {link.label}
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full" />
                                </Link>
                            ))}
                        </div>

                        <div className="flex items-center space-x-2 md:space-x-4 rtl:space-x-reverse">
                            <div className="hidden md:flex items-center space-x-2 rtl:space-x-reverse">
                                <a href="https://www.instagram.com/minelaskofficial/" target="_blank" rel="noopener noreferrer" className="p-2 text-neutral-600 hover:text-black transition-colors" aria-label="Instagram">
                                    <Instagram className="w-5 h-5" />
                                </a>
                                <a href="https://www.youtube.com/@minelask4832" target="_blank" rel="noopener noreferrer" className="p-2 text-neutral-600 hover:text-black transition-colors" aria-label="YouTube">
                                    <Youtube className="w-5 h-5" />
                                </a>
                            </div>

                            <Link href={toggleLang()} className="p-2 text-neutral-600 hover:text-black transition-colors flex items-center gap-1 md:gap-2" aria-label={`Switch to ${lang === "en" ? "Arabic" : "English"}`}>
                                <Globe className="w-4 h-4 md:w-5 md:h-5" />
                                <span className="text-xs md:text-sm font-semibold uppercase">{lang === "en" ? "AR" : "EN"}</span>
                            </Link>

                            <Link href={`/${lang}/cart`} className="p-2 text-neutral-600 hover:text-black transition-colors relative" aria-label={`Shopping Cart${cartCount > 0 ? ` (${cartCount} items)` : ''}`}>
                                <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold" aria-hidden="true">{cartCount}</span>
                                )}
                            </Link>

                            <Link
                                href={`/${lang}/admin`}
                                className="hidden"
                            >
                                <User className="w-5 h-5" />
                            </Link>

                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-neutral-600 hover:text-black transition-colors">
                                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300 ${isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`} onClick={() => setIsMenuOpen(false)} />

            <div className={`fixed top-0 right-0 h-full w-[80vw] max-w-sm bg-white z-50 md:hidden transform transition-transform duration-300 ease-out shadow-2xl ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between p-4 border-b border-neutral-100">
                        <span className="text-lg font-bold">Menu</span>
                        <button onClick={() => setIsMenuOpen(false)} className="p-2 text-neutral-600 hover:text-black transition-colors"><X className="w-6 h-6" /></button>
                    </div>

                    <div className="flex-1 overflow-y-auto py-6">
                        <nav className="flex flex-col">
                            {navLinks.map((link) => (
                                <Link key={link.href} href={link.href} className="px-6 py-4 text-lg font-medium text-neutral-800 hover:bg-neutral-50 hover:text-black transition-colors border-b border-neutral-100">{link.label}</Link>
                            ))}
                        </nav>

                        <div className="px-6 py-6 mt-4">
                            <p className="text-xs uppercase tracking-wider text-neutral-400 mb-4">Follow Us</p>
                            <a href="https://www.instagram.com/minelaskofficial/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-neutral-600 hover:text-black transition-colors py-2"><Instagram className="w-5 h-5" /><span className="text-sm">Instagram</span></a>
                            <a href="https://www.youtube.com/@minelask4832" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-neutral-600 hover:text-black transition-colors py-2"><Youtube className="w-5 h-5" /><span className="text-sm">YouTube</span></a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
