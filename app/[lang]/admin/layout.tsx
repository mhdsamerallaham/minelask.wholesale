"use client";

import { useState } from "react";
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
    Menu,
    X
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
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navItems = [
        { label: "Dashboard", href: `/${lang}/admin`, icon: LayoutDashboard },
        { label: "Products", href: `/${lang}/admin/products`, icon: Package },
        { label: "Orders", href: `/${lang}/admin/orders`, icon: ShoppingCart },
        { label: "Categories", href: `/${lang}/admin/categories`, icon: ListTree },
        { label: "Settings", href: `/${lang}/admin/settings`, icon: Settings },
    ];

    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-400 p-6 flex flex-col
                transition-transform duration-300 ease-in-out
                lg:translate-x-0
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="mb-12 flex items-center justify-between">
                    <Link href={`/${lang}`} className="text-xl font-bold font-heading text-white tracking-wider flex items-center gap-2">
                        <div className="w-8 h-8 bg-rose-700 rounded-lg flex items-center justify-center font-bold text-sm">M</div>
                        MINEL ADMIN
                    </Link>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden p-1 text-slate-400 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <nav className="flex-1 space-y-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setSidebarOpen(false)}
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
            <main className="flex-1 lg:ml-64 min-w-0">
                {/* Mobile header */}
                <div className="lg:hidden sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-slate-100 px-4 py-3 flex items-center gap-4">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 bg-slate-100 rounded-xl text-slate-600 hover:bg-slate-200 transition-colors"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-rose-700 rounded-lg flex items-center justify-center font-bold text-xs text-white">M</div>
                        <span className="font-bold text-slate-900 text-sm">MINEL ADMIN</span>
                    </div>
                </div>

                <div className="p-4 sm:p-6 lg:p-12">
                    {children}
                </div>
            </main>
        </div>
    );
}
