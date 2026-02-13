"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Settings, Save, Smartphone, Mail, Instagram, Youtube, DollarSign, Truck } from "lucide-react";

export default function AdminSettingsPage() {
    const [settings, setSettings] = useState({
        whatsapp_number: "",
        company_email: "info@minelask.com",
        company_phone: "",
        shipping_info: "",
        payment_terms: "",
        instagram_url: "",
        youtube_url: "",
        min_order_value_usd: "100"
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchSettings() {
            const { data } = await supabase.from("admin_settings").select("setting_key, setting_value");
            if (data) {
                const sObj: any = {};
                data.forEach((s: any) => sObj[s.setting_key] = s.setting_value);
                setSettings(prev => ({ ...prev, ...sObj }));
            }
        }
        fetchSettings();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const updates = Object.entries(settings).map(([key, value]) => ({
            setting_key: key,
            setting_value: value.toString()
        }));

        const { error } = await supabase.from("admin_settings").upsert(updates, { onConflict: 'setting_key' });

        if (!error) {
            alert("Settings updated successfully!");
        } else {
            alert("Error updating settings: " + error.message);
        }
        setLoading(false);
    };

    return (
        <div className="max-w-4xl space-y-8 sm:space-y-12">
            <div>
                <h1 className="text-2xl sm:text-4xl font-bold font-heading text-slate-900 leading-tight">Settings</h1>
                <p className="text-slate-500 font-medium text-sm sm:text-base">Configure your platform, contact details, and business rules.</p>
            </div>

            <form onSubmit={handleSave} className="space-y-6 sm:space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
                    {/* Contact Settings */}
                    <div className="bg-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm space-y-5 sm:space-y-6">
                        <h3 className="text-lg font-bold flex items-center gap-2">
                            <Smartphone className="w-5 h-5 text-rose-700" />
                            Contact Information
                        </h3>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-400">WhatsApp Number</label>
                                <input
                                    type="text"
                                    value={settings.whatsapp_number}
                                    onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-rose-500/20 outline-none transition-all"
                                    placeholder="+90..."
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Company Email</label>
                                <input
                                    type="email"
                                    value={settings.company_email}
                                    onChange={(e) => setSettings({ ...settings, company_email: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-rose-500/20 outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Social Media */}
                    <div className="bg-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm space-y-5 sm:space-y-6">
                        <h3 className="text-lg font-bold flex items-center gap-2">
                            <Instagram className="w-5 h-5 text-rose-700" />
                            Social Presence
                        </h3>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Instagram URL</label>
                                <input
                                    type="url"
                                    value={settings.instagram_url}
                                    onChange={(e) => setSettings({ ...settings, instagram_url: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-rose-500/20 outline-none transition-all"
                                    placeholder="https://instagram.com/..."
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-400">YouTube URL</label>
                                <input
                                    type="url"
                                    value={settings.youtube_url}
                                    onChange={(e) => setSettings({ ...settings, youtube_url: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-rose-500/20 outline-none transition-all"
                                    placeholder="https://youtube.com/..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Business Rules */}
                    <div className="bg-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm space-y-5 sm:space-y-6 md:col-span-2">
                        <h3 className="text-lg font-bold flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-rose-700" />
                            Business & Shipping Rules
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Min. Order Value (USD)</label>
                                <input
                                    type="number"
                                    value={settings.min_order_value_usd}
                                    onChange={(e) => setSettings({ ...settings, min_order_value_usd: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-rose-500/20 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Default Shipping Info</label>
                                <textarea
                                    value={settings.shipping_info}
                                    onChange={(e) => setSettings({ ...settings, shipping_info: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-rose-500/20 outline-none transition-all min-h-[100px]"
                                    placeholder="Ships within 3-5 business days..."
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full sm:w-auto bg-slate-900 text-white px-8 sm:px-10 py-3.5 sm:py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 text-sm sm:text-base"
                    >
                        {loading ? "Saving..." : <Save className="w-5 h-5" />}
                        Save All Settings
                    </button>
                </div>
            </form>
        </div>
    );
}
