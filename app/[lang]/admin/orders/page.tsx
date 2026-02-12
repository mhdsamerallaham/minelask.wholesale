"use client";

import { use, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { ShoppingBag, Eye, CheckCircle, Clock, Truck, MessageSquare, Trash2 } from "lucide-react";
import { Order } from "@/lib/types";

export default function AdminOrdersPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = use(params);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchOrders() {
            const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
            setOrders(data || []);
            setLoading(false);
        }
        fetchOrders();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-emerald-100 text-emerald-700';
            case 'shipped': return 'bg-blue-100 text-blue-700';
            case 'pending': return 'bg-amber-100 text-amber-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    const deleteOrder = async (id: string) => {
        if (!confirm("Are you sure you want to delete this order?")) return;

        const { error } = await supabase.from("orders").delete().eq("id", id);
        if (!error) {
            setOrders(orders.filter(o => o.id !== id));
        } else {
            alert("Error deleting order: " + error.message);
        }
    };

    return (
        <div className="space-y-12">
            <div>
                <h1 className="text-4xl font-bold font-heading text-slate-900 leading-tight">Orders</h1>
                <p className="text-slate-500 font-medium">Manage and track your wholesale partner orders.</p>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-slate-400">Order Ref</th>
                            <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-slate-400">Customer</th>
                            <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-slate-400">Items</th>
                            <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-slate-400">Total</th>
                            <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-slate-400">Status</th>
                            <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-slate-400">WhatsApp</th>
                            <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-slate-400 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {loading ? (
                            <tr><td colSpan={7} className="px-8 py-20 text-center text-slate-400">Loading orders...</td></tr>
                        ) : orders.length === 0 ? (
                            <tr><td colSpan={7} className="px-8 py-20 text-center text-slate-400">No orders found.</td></tr>
                        ) : orders.map((order) => (
                            <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="px-8 py-6 font-mono text-sm font-bold text-slate-600">{order.order_number}</td>
                                <td className="px-8 py-6">
                                    <div className="space-y-1">
                                        <p className="font-bold text-slate-900">{order.customer_name}</p>
                                        <p className="text-xs text-slate-400">{order.customer_country}</p>
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-slate-500 text-sm">{order.items?.length} items</td>
                                <td className="px-8 py-6 font-bold text-rose-900">${order.total_price}</td>
                                <td className="px-8 py-6">
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-8 py-6">
                                    {order.whatsapp_message_sent ? (
                                        <div className="flex items-center gap-2 text-emerald-600 text-xs font-medium">
                                            <CheckCircle className="w-4 h-4" /> Sent
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-slate-300 text-xs font-medium">
                                            <Clock className="w-4 h-4" /> Pending
                                        </div>
                                    )}
                                </td>
                                <td className="px-8 py-6 text-right space-x-2">
                                    <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-rose-700 hover:border-rose-200 transition-all shadow-sm">
                                        <Eye className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => deleteOrder(order.id)}
                                        className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-rose-700 hover:border-rose-200 transition-all shadow-sm"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
