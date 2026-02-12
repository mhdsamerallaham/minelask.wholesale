"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    ListTree,
    Settings,
    LogOut,
    Globe,
    Plus
} from "lucide-react";
import { getTranslation } from "@/lib/i18n";

import { use } from "react";

export default function AdminLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ lang: string }>;
}) {
    const { lang } = use(params);
    const pathname = usePathname();
    const t = (key: string) => getTranslation(lang, key);

    const navItems = [
        { label: "Dashboard", href: `/${lang}/admin`, icon: LayoutDashboard },
        { label: "Products", href: `/${lang}/admin/products`, icon: Package },
        { label: "Orders", href: `/${lang}/admin/orders`, icon: ShoppingCart },
        { label: "Categories", href: `/${lang}/admin/categories`, icon: ListTree },
        { label: "Settings", href: `/${lang}/admin/settings`, icon: Settings },
    ];

    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-slate-400 p-6 flex flex-col fixed inset-y-0 z-50">
                <div className="mb-12">
                    <Link href={`/${lang}`} className="text-xl font-bold font-heading text-white tracking-wider flex items-center gap-2">
                        <div className="w-8 h-8 bg-rose-700 rounded-lg flex items-center justify-center font-bold text-sm">M</div>
                        MINEL ADMIN
                    </Link>
                </div>

                <nav className="flex-1 space-y-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                    ? "bg-rose-700 text-white font-bold shadow-lg shadow-rose-900/40"
                                    : "hover:bg-slate-800 hover:text-white"
                                    }`}
                            >
                                <item.icon className="w-5 h-5" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="pt-6 border-t border-slate-800 space-y-4">
                    <Link href={`/${lang}`} className="flex items-center gap-3 px-4 py-3 hover:text-white transition-colors">
                        <Globe className="w-5 h-5" />
                        View Site
                    </Link>
                    <button className="flex items-center gap-3 px-4 py-3 text-rose-500 hover:text-rose-400 transition-colors w-full">
                        <LogOut className="w-5 h-5" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-12">
                {children}
            </main>
        </div>
    );
}
