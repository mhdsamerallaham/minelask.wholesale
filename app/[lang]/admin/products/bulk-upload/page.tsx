"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle2, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

import { use } from "react";

export default function BulkUploadPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = use(params);
    const router = useRouter();
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ success?: boolean; message?: string; error?: string }>({});

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile && (selectedFile.name.endsWith('.xlsx') || selectedFile.name.endsWith('.csv'))) {
            setFile(selectedFile);
        } else {
            alert("Please select a valid Excel (.xlsx) or CSV file.");
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        setLoading(true);
        setStatus({});

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("/api/products/bulk-import", {
                method: "POST",
                body: formData,
            });

            const result = await response.json();

            if (result.success) {
                setStatus({ success: true, message: `Successfully imported ${result.count} products.` });
                setTimeout(() => router.push(`/${lang}/admin/products`), 3000);
            } else {
                setStatus({ error: result.error || "Failed to import products." });
            }
        } catch (error) {
            setStatus({ error: "An unexpected error occurred during upload." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-12">
            <div className="flex items-center gap-4">
                <Link href={`/${lang}/admin/products`} className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-slate-900 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-4xl font-bold font-heading text-slate-900 leading-tight">Bulk Upload</h1>
                    <p className="text-slate-500 font-medium">Add multiple products at once using an Excel or CSV file.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-8">
                    <form onSubmit={handleUpload} className="bg-white p-12 rounded-3xl border border-slate-100 shadow-sm space-y-8 text-center">
                        <div className="space-y-4">
                            <div className={`mx-auto w-24 h-24 rounded-3xl flex items-center justify-center transition-colors ${file ? 'bg-rose-100 text-rose-700' : 'bg-slate-50 text-slate-300'}`}>
                                <FileSpreadsheet className="w-12 h-12" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">{file ? file.name : "Select your file"}</h3>
                                <p className="text-slate-500 text-sm">Drag and drop or click to browse</p>
                            </div>
                        </div>

                        <div className="relative group">
                            <input
                                type="file"
                                accept=".xlsx, .csv"
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <button
                                type="button"
                                className="w-full py-20 border-2 border-dashed border-slate-200 rounded-3xl group-hover:border-rose-400 group-hover:bg-rose-50/50 transition-all flex items-center justify-center text-slate-400 font-medium"
                            >
                                {file ? "Change File" : "Choose Excel or CSV File"}
                            </button>
                        </div>

                        {status.error && (
                            <div className="bg-rose-50 text-rose-700 p-4 rounded-xl flex items-center gap-3 justify-center font-medium">
                                <AlertCircle className="w-5 h-5" />
                                {status.error}
                            </div>
                        )}

                        {status.success && (
                            <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl flex items-center gap-3 justify-center font-medium">
                                <CheckCircle2 className="w-5 h-5" />
                                {status.message}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={!file || loading}
                            className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all ${!file || loading
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                : 'bg-rose-700 text-white hover:bg-rose-800 shadow-lg shadow-rose-900/20'
                                }`}
                        >
                            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Upload className="w-6 h-6" />}
                            {loading ? "Processing..." : "Start Import"}
                        </button>
                    </form>
                </div>

                <div className="space-y-8">
                    <div className="bg-slate-900 text-white p-8 rounded-3xl space-y-6">
                        <h3 className="text-lg font-bold">Import Instructions</h3>
                        <ul className="space-y-4 text-sm text-slate-400">
                            <li className="flex gap-3">
                                <div className="w-5 h-5 rounded-full bg-rose-700 flex items-center justify-center text-[10px] font-bold text-white shrink-0">1</div>
                                Use our standard Excel template to ensure all fields match.
                            </li>
                            <li className="flex gap-3">
                                <div className="w-5 h-5 rounded-full bg-rose-700 flex items-center justify-center text-[10px] font-bold text-white shrink-0">2</div>
                                SKU must be unique for every product.
                            </li>
                            <li className="flex gap-3">
                                <div className="w-5 h-5 rounded-full bg-rose-700 flex items-center justify-center text-[10px] font-bold text-white shrink-0">3</div>
                                Image URLs must be direct public links.
                            </li>
                        </ul>
                        <a
                            href="/template.xlsx"
                            className="block w-full text-center py-3 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-100 transition-colors"
                        >
                            Download Template
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
