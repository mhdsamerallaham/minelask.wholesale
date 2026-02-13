"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { ShoppingBag, Package, Users, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
    const router = useRouter();
    const params = useParams();
    const lang = params.lang as string;
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

    const [stats, setStats] = useState({
        totalOrders: 0,
        totalProducts: 0,
        pendingOrders: 0,
        totalSales: 0
    });

    // Check authentication
    useEffect(() => {
        const auth = localStorage.getItem("admin_auth");
        if (auth !== "true") {
            router.push(`/${lang}/login`);
        } else {
            setIsAuthenticated(true);
        }
        setIsChecking(false);
    }, [lang, router]);

    const handleLogout = () => {
        localStorage.removeItem("admin_auth");
        router.push(`/${lang}/login`);
    };

    useEffect(() => {
        if (!isAuthenticated) return;

        async function fetchStats() {
            const { count: orderCount } = await supabase.from("orders").select("*", { count: 'exact', head: true });
            const { count: prodCount } = await supabase.from("products").select("*", { count: 'exact', head: true });
            const { count: pendingCount } = await supabase.from("orders").select("*", { count: 'exact', head: true }).eq("status", "pending");

            const { data: salesData } = await supabase.from("orders").select("total_price");
            const totalSales = salesData?.reduce((sum: number, order: any) => sum + (order.total_price || 0), 0) || 0;

            setStats({
                totalOrders: orderCount || 0,
                totalProducts: prodCount || 0,
                pendingOrders: pendingCount || 0,
                totalSales: totalSales
            });
        }

        fetchStats();
    }, [isAuthenticated]);

    const cards = [
        { label: "Total Sales", value: `$${stats.totalSales.toLocaleString()}`, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
        { label: "Total Orders", value: stats.totalOrders.toString(), icon: ShoppingBag, color: "text-blue-600", bg: "bg-blue-50" },
        { label: "Products", value: stats.totalProducts.toString(), icon: Package, color: "text-rose-600", bg: "bg-rose-50" },
        { label: "Pending Orders", value: stats.pendingOrders.toString(), icon: Users, color: "text-amber-600", bg: "bg-amber-50" },
    ];

    // Show loading while checking auth
    if (isChecking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-500">Loading...</p>
                </div>
            </div>
        );
    }

    // Don't render if not authenticated (will redirect)
    if (!isAuthenticated) {
        return null;
    }

    // Dashboard (when authenticated)
    return (
        <div className="space-y-12">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold font-heading text-slate-900 leading-tight">Dashboard Overview</h1>
                    <p className="text-slate-500 font-medium">Welcome back to the admin control panel.</p>
                </div>
                <button
                    onClick={handleLogout}
                    className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-colors"
                >
                    Logout
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {cards.map((card) => (
                    <div key={card.label} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-4">
                        <div className={`w-14 h-14 ${card.bg} ${card.color} rounded-2xl flex items-center justify-center`}>
                            <card.icon className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">{card.label}</p>
                            <h3 className="text-3xl font-bold text-slate-900">{card.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Orders Table Placeholder */}
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold">Recent Orders</h2>
                        <button className="text-rose-700 font-bold text-sm hover:underline">View All</button>
                    </div>
                    <div className="space-y-4">
                        {/* List items would go here */}
                        <div className="py-20 text-center text-slate-400">
                            No recent orders found.
                        </div>
                    </div>
                </div>

                {/* Top Products Placeholder */}
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold">Best Selling Products</h2>
                        <button className="text-rose-700 font-bold text-sm hover:underline">View All</button>
                    </div>
                    <div className="space-y-4">
                        {/* List items would go here */}
                        <div className="py-20 text-center text-slate-400">
                            No sales data available.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
