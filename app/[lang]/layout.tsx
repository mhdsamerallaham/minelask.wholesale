import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { reportWebVitals } from "@/lib/analytics";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Minel Ask Wholesale - Premium Fashion Wholesale",
  description: "Premium wholesale fashion collection with worldwide shipping. Discover our exclusive range of evening wear, modest collection, and luxury fabrics.",
  keywords: ["wholesale", "fashion", "evening wear", "modest collection", "luxury fabrics", "minel ask"],
  authors: [{ name: "Minel Ask Wholesale" }],
  openGraph: {
    title: "Minel Ask Wholesale - Premium Fashion Wholesale",
    description: "Premium wholesale fashion collection with worldwide shipping",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Minel Ask Wholesale - Premium Fashion Wholesale",
    description: "Premium wholesale fashion collection with worldwide shipping",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//mcsslrdanlletbobsvss.supabase.co" />
        
        {/* Performance optimizations */}
        <link rel="preload" href="/images/hero.png" as="image" />
        
        {/* Critical CSS inline */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Critical CSS for above-the-fold content */
            body { margin: 0; font-family: ${inter.style.fontFamily}; }
            .loading-skeleton { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
            @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }
          `
        }} />
      </head>
      <body className={inter.className}>
        <div id="root">
          {children}
        </div>
        
        {/* Performance monitoring */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined') {
                // Report Web Vitals
                import('web-vitals').then(({ onCLS, onFID, onFCP, onLCP, onTTFB }) => {
                  onCLS(console.log);
                  onFID(console.log);
                  onFCP(console.log);
                  onLCP(console.log);
                  onTTFB(console.log);
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
