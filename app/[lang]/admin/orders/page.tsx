"use client";

import { use, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { ShoppingBag, Eye, CheckCircle, Clock, Truck, MessageSquare, Trash2, X, Save, AlertCircle } from "lucide-react";
import { Order } from "@/lib/types";

export default function AdminOrdersPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = use(params);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);

    async function fetchOrders() {
        setLoading(true);
        const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
        if (data) {
            setOrders(data as Order[]);
        }
        setLoading(false);
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-emerald-100 text-emerald-700';
            case 'shipped': return 'bg-blue-100 text-blue-700';
            case 'confirmed': return 'bg-purple-100 text-purple-700';
            case 'cancelled': return 'bg-rose-100 text-rose-700';
            case 'pending': return 'bg-amber-100 text-amber-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    const deleteOrder = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent opening modal
        if (!confirm("Are you sure you want to delete this order?")) return;

        const { error } = await supabase.from("orders").delete().eq("id", id);
        if (!error) {
            setOrders(orders.filter(o => o.id !== id));
            if (selectedOrder?.id === id) setSelectedOrder(null);
        } else {
            alert("Error deleting order: " + error.message);
        }
    };

    const handleSaveOrder = async () => {
        if (!selectedOrder) return;
        setIsSaving(true);

        try {
            // Recalculate total
            const newTotal = selectedOrder.items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);

            const { error } = await supabase.from("orders").update({
                status: selectedOrder.status,
                items: selectedOrder.items,
                total_price: newTotal
            }).eq("id", selectedOrder.id);

            if (error) throw error;

            // Update local state
            setOrders(orders.map(o => o.id === selectedOrder.id ? { ...selectedOrder, total_price: newTotal } : o));
            alert("Order updated successfully!");
            setSelectedOrder(null);
        } catch (err: any) {
            alert("Failed to update order: " + err.message);
        } finally {
            setIsSaving(false);
        }
    };

    const updateItem = (index: number, field: string, value: any) => {
        if (!selectedOrder) return;
        const newItems = [...selectedOrder.items];
        newItems[index] = { ...newItems[index], [field]: value };
        setSelectedOrder({ ...selectedOrder, items: newItems });
    };

    const removeItem = (index: number) => {
        if (!selectedOrder) return;
        const newItems = selectedOrder.items.filter((_, i) => i !== index);
        setSelectedOrder({ ...selectedOrder, items: newItems });
    };

    return (
        <div className="space-y-12 relative">
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
                            <tr
                                key={order.id}
                                onClick={() => setSelectedOrder(order)}
                                className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                            >
                                <td className="px-8 py-6 font-mono text-sm font-bold text-slate-600">{order.order_number}</td>
                                <td className="px-8 py-6">
                                    <div className="space-y-1">
                                        <p className="font-bold text-slate-900">{order.customer_name}</p>
                                        <p className="text-xs text-slate-400">{order.customer_country}</p>
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-slate-500 text-sm">{order.items?.length || 0} items</td>
                                <td className="px-8 py-6 font-bold text-rose-900">${order.total_price?.toFixed(2)}</td>
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
                                <td className="px-8 py-6 text-right space-x-2" onClick={(e) => e.stopPropagation()}>
                                    <button
                                        onClick={() => setSelectedOrder(order)}
                                        className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={(e) => deleteOrder(order.id, e)}
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

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                        {/* Header */}
                        <div className="flex items-center justify-between p-8 border-b border-slate-100 bg-slate-50/50">
                            <div>
                                <div className="flex items-center gap-4">
                                    <h2 className="text-2xl font-bold font-heading text-slate-900">Order Details</h2>
                                    <span className="font-mono text-sm text-slate-400 bg-white px-2 py-1 rounded border border-slate-200">{selectedOrder.order_number}</span>
                                </div>
                                <p className="text-slate-500 text-sm mt-1">
                                    Placed on {new Date(selectedOrder.created_at).toLocaleDateString()} at {new Date(selectedOrder.created_at).toLocaleTimeString()}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="overflow-y-auto p-8 space-y-8 flex-1">
                            {/* Customer & Status */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4 bg-slate-50 p-6 rounded-2xl">
                                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4 text-slate-400" />
                                        Customer Info
                                    </h3>
                                    <div className="space-y-2 text-sm">
                                        <p><span className="text-slate-400 w-24 inline-block">Name:</span> <strong>{selectedOrder.customer_name}</strong></p>
                                        <p><span className="text-slate-400 w-24 inline-block">Phone:</span> {selectedOrder.customer_phone}</p>
                                        <p><span className="text-slate-400 w-24 inline-block">Email:</span> {selectedOrder.customer_email || '-'}</p>
                                        <p><span className="text-slate-400 w-24 inline-block">Country:</span> {selectedOrder.customer_country}</p>
                                    </div>
                                </div>

                                <div className="space-y-4 bg-slate-50 p-6 rounded-2xl">
                                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-slate-400" />
                                        Order Status
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="flex flex-wrap gap-2">
                                            {['pending', 'confirmed', 'shipped', 'completed', 'cancelled'].map((s) => (
                                                <button
                                                    key={s}
                                                    onClick={() => setSelectedOrder({ ...selectedOrder, status: s as any })}
                                                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest border transition-all ${selectedOrder.status === s
                                                            ? 'bg-slate-900 text-white border-slate-900 shadow-lg'
                                                            : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                                                        }`}
                                                >
                                                    {s}
                                                </button>
                                            ))}
                                        </div>
                                        <p className="text-xs text-slate-400">
                                            Current Status: <span className="font-bold text-slate-700 uppercase">{selectedOrder.status}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Items */}
                            <div className="space-y-4">
                                <h3 className="font-bold text-slate-900 text-lg">Order Items ({selectedOrder.items?.length || 0})</h3>
                                <div className="border border-slate-200 rounded-2xl overflow-hidden">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-slate-50 border-b border-slate-200">
                                            <tr>
                                                <th className="px-6 py-4 font-bold text-slate-500">Item</th>
                                                <th className="px-6 py-4 font-bold text-slate-500">Color/Size</th>
                                                <th className="px-6 py-4 font-bold text-slate-500">Price ($)</th>
                                                <th className="px-6 py-4 font-bold text-slate-500">Qty</th>
                                                <th className="px-6 py-4 font-bold text-slate-500 text-right">Subtotal</th>
                                                <th className="px-6 py-4 font-bold text-slate-500 w-10"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {selectedOrder.items?.map((item: any, idx: number) => (
                                                <tr key={idx} className="bg-white">
                                                    <td className="px-6 py-4 font-medium text-slate-900">{item.name || item.name_en}</td>
                                                    <td className="px-6 py-4 text-slate-500">
                                                        {item.color}
                                                        {item.size && <span className="ml-2 bg-slate-100 px-1.5 py-0.5 rounded textxs font-bold">{item.size}</span>}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <input
                                                            type="number"
                                                            value={item.price}
                                                            onChange={(e) => updateItem(idx, 'price', parseFloat(e.target.value))}
                                                            className="w-20 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-rose-500"
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <input
                                                            type="number"
                                                            value={item.quantity}
                                                            onChange={(e) => updateItem(idx, 'quantity', parseInt(e.target.value))}
                                                            className="w-16 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-rose-500"
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4 text-right font-bold text-slate-700">
                                                        ${((item.price || 0) * (item.quantity || 0)).toFixed(2)}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button
                                                            onClick={() => removeItem(idx)}
                                                            className="text-slate-300 hover:text-rose-600 transition-colors"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {(!selectedOrder.items || selectedOrder.items.length === 0) && (
                                                <tr>
                                                    <td colSpan={6} className="px-6 py-8 text-center text-slate-400 italic">No items in this order.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                        <tfoot className="bg-slate-50 border-t border-slate-200">
                                            <tr>
                                                <td colSpan={4} className="px-6 py-4 text-right font-bold text-slate-500">Total Amount:</td>
                                                <td className="px-6 py-4 text-right font-bold text-xl text-rose-900">
                                                    ${selectedOrder.items?.reduce((sum: number, i: any) => sum + ((i.price || 0) * (i.quantity || 0)), 0).toFixed(2)}
                                                </td>
                                                <td></td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-4">
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="px-6 py-3 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-100 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveOrder}
                                disabled={isSaving}
                                className="px-8 py-3 bg-rose-700 text-white font-bold rounded-xl hover:bg-rose-800 transition-all shadow-lg shadow-rose-900/20 flex items-center gap-2 disabled:opacity-50"
                            >
                                {isSaving ? <Clock className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
