'use client';

import React, { useState, useRef } from 'react';
import { useReviews } from '@/hooks/useReviews';
import { Review } from '@/api/reviews.api';
import { Loader2, MessageSquare } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import ReviewForm from './Reviews/ReviewForm';
import ReviewList from './Reviews/ReviewList';

interface ReviewsSectionProps {
    productId: string;
}

export default function ReviewsSection({ productId }: ReviewsSectionProps) {
    const {
        reviews,
        isLoading,
        isSubmitting,
        userHasReviewed,
        addReview,
        editReview,
        removeReview,
        isLoggedIn,
        userId
    } = useReviews(productId);

    const reviewFormRef = useRef<HTMLDivElement>(null);
    const [editingReview, setEditingReview] = useState<{ id: string; review: string; rating: number } | null>(null);
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; reviewId: string | null }>({
        isOpen: false,
        reviewId: null
    });

    const handleEditClick = (review: Review) => {
        setEditingReview({ id: review._id, review: review.review, rating: review.rating });
        if (reviewFormRef.current) {
            const offset = reviewFormRef.current.offsetTop - 100;
            window.scrollTo({ top: offset, behavior: 'smooth' });
        }
    };

    const handleCancelEdit = () => {
        setEditingReview(null);
    };

    const handleSubmit = async (text: string, rating: number) => {
        if (editingReview) {
            const success = await editReview(editingReview.id, text, rating);
            if (success) {
                setEditingReview(null);
            }
            return success;
        } else {
            return await addReview(text, rating);
        }
    };

    const handleDeleteClick = (reviewId: string) => {
        setDeleteModal({ isOpen: true, reviewId });
    };

    const confirmDelete = async () => {
        if (deleteModal.reviewId) {
            await removeReview(deleteModal.reviewId);
            setDeleteModal({ isOpen: false, reviewId: null });
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center py-10">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            </div>
        );
    }

    return (
        <section className="w-full max-w-4xl py-12 mx-auto mt-12 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3 mb-10">
                <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl text-emerald-600 dark:text-emerald-500">
                    <MessageSquare size={24} />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-slate-50">Customer Reviews</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{reviews.length} people shared their thoughts</p>
                </div>
            </div>

            <div ref={reviewFormRef} id="review-form">
                <ReviewForm
                    isLoggedIn={isLoggedIn}
                    userHasReviewed={userHasReviewed}
                    isSubmitting={isSubmitting}
                    editingReview={editingReview}
                    onSubmit={handleSubmit}
                    onCancelEdit={handleCancelEdit}
                />
            </div>

            <ReviewList
                reviews={reviews}
                userId={userId!}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
            />

            <AnimatePresence>
                {deleteModal.isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-sm p-6 bg-white dark:bg-slate-900 shadow-2xl rounded-3xl border dark:border-slate-800"
                        >
                            <h3 className="mb-2 text-xl font-bold text-center text-slate-900 dark:text-slate-100">Delete Review?</h3>
                            <p className="mb-6 text-sm text-center text-slate-500 dark:text-slate-400">
                                Are you sure you want to delete your comment?
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setDeleteModal({ isOpen: false, reviewId: null })}
                                    className="flex-1 py-3 font-bold text-slate-700 dark:text-slate-300 transition-colors bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="flex-1 py-3 font-bold text-white transition-colors bg-red-500 rounded-xl hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    );
}
