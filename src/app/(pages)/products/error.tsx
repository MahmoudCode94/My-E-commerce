"use client"; // دي أهم سطر

import { useEffect } from "react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Client Side Error Log:", error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="p-8 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900/20">
                <h2 className="text-2xl font-bold text-red-700 dark:text-red-400 mb-4">عفواً، حدث خطأ ما!</h2>
                <p className="text-slate-600 dark:text-slate-300 mb-6">{error.message || "فشل تحميل البيانات"}</p>
                <button
                    onClick={() => reset()}
                    className="bg-slate-900 dark:bg-slate-800 text-white px-6 py-2 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-700 transition-all"
                >
                    حاول مرة أخرى
                </button>
            </div>
        </div>
    );
}