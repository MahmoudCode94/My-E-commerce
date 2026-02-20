'use client';

import React, { useState, useEffect } from 'react';
import { Loader2, Star, Send, X } from 'lucide-react';

interface ReviewFormProps {
    isLoggedIn: boolean;
    userHasReviewed: boolean;
    isSubmitting: boolean;
    editingReview?: { id: string; review: string; rating: number } | null;
    onSubmit: (text: string, rating: number) => Promise<boolean | void>;
    onCancelEdit?: () => void;
}

export default function ReviewForm({
    isLoggedIn,
    userHasReviewed,
    isSubmitting,
    editingReview,
    onSubmit,
    onCancelEdit
}: ReviewFormProps) {
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(5);

    useEffect(() => {
        if (editingReview) {
            setReviewText(editingReview.review);
            setRating(editingReview.rating);
        } else {
            setReviewText('');
            setRating(5);
        }
    }, [editingReview]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await onSubmit(reviewText, rating);
        if (success && !editingReview) {
            setReviewText('');
            setRating(5);
        }
    };

    if (!isLoggedIn) {
        return (
            <div className="mb-12 p-8 text-center bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800">
                <h3 className="mb-2 text-xl font-bold text-slate-900 dark:text-slate-100">Share your thoughts</h3>
                <p className="mb-6 text-slate-500 dark:text-slate-400">Please login to write a review about this product.</p>
                <a href="/login" className="px-8 py-3 font-bold text-white transition-all bg-slate-900 dark:bg-emerald-600 rounded-xl hover:bg-emerald-600 dark:hover:bg-emerald-700 shadow-lg shadow-emerald-900/20">Login to Review</a>
            </div>
        );
    }

    if (userHasReviewed && !editingReview) {
        return (
            <div className="mb-12 p-6 bg-emerald-50 dark:bg-emerald-900/10 rounded-[2.5rem] border border-emerald-100 dark:border-emerald-900/20 text-center">
                <h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-400">You&apos;ve already reviewed this product</h3>
                <p className="text-emerald-600 dark:text-emerald-500/80 text-sm mt-1">Thanks for sharing your experience! You can edit your review below.</p>
            </div>
        );
    }

    return (
        <div className="mb-12 p-6 bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800">
            <h3 className="mb-4 text-lg font-bold text-slate-800 dark:text-slate-200">
                {editingReview ? 'Edit your review' : 'Write a review'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-2 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className="transition-transform active:scale-90"
                        >
                            <Star
                                size={24}
                                className={`${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300 dark:text-slate-600'} transition-colors`}
                            />
                        </button>
                    ))}
                </div>
                <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="What did you think of the product?"
                    className="w-full p-4 text-sm bg-white dark:bg-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 min-h-[120px] transition-all placeholder:text-slate-400"
                    required
                />
                <div className="flex gap-3">
                    <button
                        disabled={isSubmitting}
                        type="submit"
                        className="flex items-center justify-center gap-2 px-8 py-3 font-bold text-white transition-all bg-emerald-600 rounded-xl hover:bg-emerald-700 disabled:opacity-50"
                    >
                        {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                        {editingReview ? 'Update Review' : 'Post Review'}
                    </button>
                    {editingReview && onCancelEdit && (
                        <button
                            type="button"
                            onClick={onCancelEdit}
                            className="flex items-center justify-center gap-2 px-6 py-3 font-bold text-slate-500 dark:text-slate-300 transition-all bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700"
                        >
                            <X size={18} />
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}
