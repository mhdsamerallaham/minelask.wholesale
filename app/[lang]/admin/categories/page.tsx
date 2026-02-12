"use client";

import { use, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { Plus, Trash2, Edit2, Loader2, ListTree, Save } from "lucide-react";
import { Category } from "@/lib/types";

export default function AdminCategoriesPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = use(params);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Form state for new/edit
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState({
        name_en: "",
        name_ar: "",
        slug: "",
        is_active: true
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    async function fetchCategories() {
        setLoading(true);
        const { data } = await supabase.from("categories").select("*").order("name_en");
        setCategories(data || []);
        setLoading(false);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        if (editingId) {
            const { error } = await supabase.from("categories").update(form).eq("id", editingId);
            if (!error) {
                setEditingId(null);
                setForm({ name_en: "", name_ar: "", slug: "", is_active: true });
                fetchCategories();
            } else {
                alert(error.message);
            }
        } else {
            const { error } = await supabase.from("categories").insert([form]);
            if (!error) {
                setForm({ name_en: "", name_ar: "", slug: "", is_active: true });
                fetchCategories();
            } else {
                alert(error.message);
            }
        }
        setSaving(false);
    };

    const handleEdit = (category: Category) => {
        setEditingId(category.id);
        setForm({
            name_en: category.name_en,
            name_ar: category.name_ar,
            slug: category.slug,
            is_active: category.is_active
        });
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure? This might affect products in this category.")) return;
        const { error } = await supabase.from("categories").delete().eq("id", id);
        if (!error) fetchCategories();
        else alert(error.message);
    };

    const generateSlug = (name: string) => {
        return name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    };

    return (
        <div className="space-y-12">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-bold font-heading text-slate-900 leading-tight">Categories</h1>
                    <p className="text-slate-500 font-medium">Manage product categories and collections.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Form */}
                <div className="lg:col-span-1">
                    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6 sticky top-8">
                        <h3 className="text-xl font-bold">{editingId ? "Edit Category" : "Add New Category"}</h3>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-400">English Name</label>
                                <input
                                    type="text"
                                    required
                                    value={form.name_en}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setForm({ ...form, name_en: val, slug: editingId ? form.slug : generateSlug(val) });
                                    }}
                                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Arabic Name</label>
                                <input
                                    type="text"
                                    required
                                    dir="rtl"
                                    value={form.name_ar}
                                    onChange={(e) => setForm({ ...form, name_ar: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl outline-none font-heading"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Slug</label>
                                <input
                                    type="text"
                                    required
                                    value={form.slug}
                                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl outline-none font-mono text-sm"
                                />
                            </div>
                            <div className="flex items-center gap-3 pt-2">
                                <input
                                    type="checkbox"
                                    id="is_active"
                                    checked={form.is_active}
                                    onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                                    className="w-5 h-5 accent-rose-700"
                                />
                                <label htmlFor="is_active" className="text-sm font-bold text-slate-700">Active</label>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            {editingId && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingId(null);
                                        setForm({ name_en: "", name_ar: "", slug: "", is_active: true });
                                    }}
                                    className="flex-1 py-4 px-6 border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-all"
                                >
                                    Cancel
                                </button>
                            )}
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex-[2] py-4 px-6 bg-rose-700 text-white rounded-2xl font-bold hover:bg-rose-800 shadow-lg shadow-rose-900/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : editingId ? <Save className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                                {editingId ? "Update Category" : "Add Category"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* List */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-slate-400">Name</th>
                                    <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-slate-400">Slug</th>
                                    <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-slate-400 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {loading ? (
                                    <tr><td colSpan={3} className="px-8 py-20 text-center text-slate-400">Loading categories...</td></tr>
                                ) : categories.length === 0 ? (
                                    <tr><td colSpan={3} className="px-8 py-20 text-center text-slate-400">No categories found.</td></tr>
                                ) : categories.map((cat) => (
                                    <tr key={cat.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="space-y-1">
                                                <p className="font-bold text-slate-900">{cat.name_en}</p>
                                                <p className="text-xs text-slate-400 font-heading" dir="rtl">{cat.name_ar}</p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 font-mono text-sm text-slate-400">{cat.slug}</td>
                                        <td className="px-8 py-6 text-right space-x-2">
                                            <button
                                                onClick={() => handleEdit(cat)}
                                                className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(cat.id)}
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
            </div>
        </div>
    );
}
