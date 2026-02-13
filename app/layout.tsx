import type { Metadata } from "next";
import { Inter, Outfit, Noto_Sans_Arabic } from "next/font/google";
import "./globals.css";
import { defaultLocale } from "@/lib/i18n";
import { headers } from "next/headers";

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
});

const outfit = Outfit({
    variable: "--font-outfit",
    subsets: ["latin"],
});

const notoArabic = Noto_Sans_Arabic({
    variable: "--font-noto-arabic",
    subsets: ["arabic"],
});

export const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://minelask-wholesale.vercel.app'),
    title: "Minel Aşk | Wholesale Fashion",
    description: "Premium wholesale dresses, photography, and digital services for global partners.",
    icons: {
        icon: '/icon.jpeg',
        shortcut: '/icon.jpeg',
        apple: '/icon.jpeg',
    },
    openGraph: {
        images: ['/icon.jpeg'],
    },
};

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const headerList = await headers();
    const lang = headerList.get("x-lang") || defaultLocale;
    const dir = lang === 'ar' ? 'rtl' : 'ltr';

    return (
        <html lang={lang} dir={dir}>
            <body
                className={`${inter.variable} ${outfit.variable} ${notoArabic.variable} antialiased font-sans`}
            >
                {children}
            </body>
        </html>
    );
}
