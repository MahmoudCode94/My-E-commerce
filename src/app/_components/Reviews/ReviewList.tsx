'use client';

import React from 'react';
import { Review } from '@/api/reviews.api';
import { UserCircle, Star, Edit2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ReviewListProps {
    reviews: Review[];
    userId?: string;
    onEdit: (review: Review) => void;
    onDelete: (reviewId: string) => void;
}

export default function ReviewList({ reviews, userId, onEdit, onDelete }: ReviewListProps) {
    if (reviews.length === 0) {
        return (
            <div className="py-20 text-center bg-slate-50/50 dark:bg-slate-900/50 rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-800">
                <p className="text-slate-400 dark:text-slate-500">No reviews yet. Be the first to share your experience!</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <AnimatePresence>
                {reviews.map((review) => {
                    const isOwner = userId === review.user?._id;
                    return (
                        <motion.div
                            key={review._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            layout
                            className={`p-6 transition-all rounded-[2rem] hover:shadow-lg border
                                ${isOwner
                                    ? 'bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800 ring-1 ring-emerald-100 dark:ring-emerald-900/30'
                                    : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 dark:hover:border-slate-700'
                                }
                            `}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={`flex items-center justify-center w-10 h-10 font-bold rounded-full
                                        ${isOwner ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200 dark:shadow-none' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}
                                    `}>
                                        {isOwner ? <UserCircle size={20} /> : (review.user?.name?.charAt(0) || 'U')}
                                    </div>
                                    <div>
                                        <h4 className={`font-bold flex items-center gap-2 ${isOwner ? 'text-emerald-800 dark:text-emerald-400' : 'text-slate-900 dark:text-slate-200'}`}>
                                            {isOwner ? 'You' : (review.user?.name || 'Anonymous')}
                                            {isOwner && <span className="text-[10px] bg-emerald-200 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-200 px-2 py-0.5 rounded-full">Your Review</span>}
                                        </h4>
                                        <div className="flex gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={12}
                                                    className={`${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200 dark:text-slate-700'}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    {isOwner && (
                                        <>
                                            <button
                                                onClick={() => onEdit(review)}
                                                className="p-2 transition-colors text-slate-400 hover:text-emerald-600 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => onDelete(review._id)}
                                                className="p-2 transition-colors text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                            <p className="leading-relaxed text-slate-600 dark:text-slate-400 italic">
                                &quot;{review.review}&quot;
                            </p>
                            <div className="mt-4 text-[10px] font-medium uppercase tracking-widest text-slate-400 dark:text-slate-500">
                                {new Date(review.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                            </div>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
}
