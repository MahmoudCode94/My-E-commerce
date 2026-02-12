'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { getReviewsForProduct, createReview, updateReview, deleteReview, Review } from '@/api/reviews.api';
import { useAuth } from '@/context/AuthContext';
import { Loader2, Star, Trash2, Edit2, MessageSquare, Send, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface ReviewsSectionProps {
    productId: string;
}

export default function ReviewsSection({ productId }: ReviewsSectionProps) {
    const { isLoggedIn, userId, userName } = useAuth();

    const reviewFormRef = React.useRef<HTMLDivElement>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);


    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(5);
    const [editingReviewId, setEditingReviewId] = useState<string | null>(null);

    const loadReviews = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await getReviewsForProduct(productId);
            setReviews(data.data || []);
        } catch (error: any) {
            console.error('Error loading reviews:', error);

        } finally {
            setIsLoading(false);
        }
    }, [productId]);

    useEffect(() => {
        loadReviews();
    }, [loadReviews]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isLoggedIn) {
            toast.error('Please login to leave a review');
            return;
        }
        if (!reviewText.trim()) {
            toast.error('Please enter a review message');
            return;
        }

        setIsSubmitting(true);
        try {
            if (editingReviewId) {
                const res = await updateReview(editingReviewId, { review: reviewText, rating });
                setReviews(prev => prev.map(r => {
                    if (r._id === editingReviewId) {
                        return { ...res.data, user: r.user };
                    }
                    return r;
                }));
                toast.success('Review updated! ✨');
            } else {
                const res = await createReview(productId, { review: reviewText, rating });

                const newReview = {
                    ...res.data,
                    user: {
                        _id: userId,
                        name: userName,
                        email: ''
                    }
                };
                setReviews(prev => [newReview, ...prev]);
                toast.success('Review posted! 🎉');
            }
            resetForm();
        } catch (error: any) {
            toast.error(error.message || 'Action failed');
        } finally {
            setIsSubmitting(false);
        }
    };


    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; reviewId: string | null }>({
        isOpen: false,
        reviewId: null
    });

    const handleDeleteClick = (reviewId: string) => {
        setDeleteModal({ isOpen: true, reviewId });
    };

    const confirmDelete = async () => {
        if (!deleteModal.reviewId) return;

        const reviewId = deleteModal.reviewId;

        setReviews(prev => prev.filter(r => r._id !== reviewId));
        setDeleteModal({ isOpen: false, reviewId: null });

        try {
            await deleteReview(reviewId);
            toast.success('Review deleted');
        } catch (error: any) {

            toast.error(error.message || 'Delete failed');
            loadReviews();
        }
    };



    const handleEdit = (review: Review) => {
        setEditingReviewId(review._id);
        setReviewText(review.review);
        setRating(review.rating);

        if (reviewFormRef.current) {
            const offset = reviewFormRef.current.offsetTop - 100;
            window.scrollTo({ top: offset, behavior: 'smooth' });
        }
    };

    const resetForm = () => {
        setEditingReviewId(null);
        setReviewText('');
        setRating(5);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center py-10">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            </div>
        );
    }

    return (
        <section className="w-full max-w-4xl py-12 mx-auto mt-12 border-t border-slate-100">
            <div className="flex items-center gap-3 mb-10">
                <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
                    <MessageSquare size={24} />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-slate-900">Customer Reviews</h2>
                    <p className="text-sm text-slate-500">{reviews.length} people shared their thoughts</p>
                </div>
            </div>


            <div ref={reviewFormRef} id="review-form" className="mb-12 p-6 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                <h3 className="mb-4 text-lg font-bold text-slate-800">
                    {editingReviewId ? 'Edit your review' : 'Write a review'}
                </h3>
                {isLoggedIn ? (
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
                                        className={`${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'} transition-colors`}
                                    />
                                </button>
                            ))}
                        </div>
                        <textarea
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            placeholder="What did you think of the product?"
                            className="w-full p-4 text-sm bg-white border border-slate-200 rounded-2xl outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 min-h-[120px] transition-all"
                        />
                        <div className="flex gap-3">
                            <button
                                disabled={isSubmitting}
                                type="submit"
                                className="flex items-center justify-center gap-2 px-8 py-3 font-bold text-white transition-all bg-emerald-600 rounded-xl hover:bg-emerald-700 disabled:opacity-50"
                            >
                                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                                {editingReviewId ? 'Update Review' : 'Post Review'}
                            </button>
                            {editingReviewId && (
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="flex items-center justify-center gap-2 px-6 py-3 font-bold text-slate-500 transition-all bg-white border border-slate-200 rounded-xl hover:bg-slate-100"
                                >
                                    <X size={18} />
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                ) : (
                    <div className="py-4 text-center">
                        <p className="mb-4 text-slate-500">You must be logged in to post a review.</p>
                        <a href="/login" className="px-6 py-2 font-bold text-white transition-all bg-slate-900 rounded-xl hover:bg-emerald-600">Login now</a>
                    </div>
                )}
            </div>


            <div className="space-y-6">
                <AnimatePresence>
                    {reviews.length > 0 ? (
                        reviews.map((review) => {
                            const isOwner = userId === review.user?._id;
                            return (
                                <motion.div
                                    key={review._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="p-6 transition-all bg-white border border-slate-100 rounded-[2rem] hover:shadow-lg"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center justify-center w-10 h-10 font-bold bg-emerald-100 rounded-full text-emerald-700">
                                                {review.user?.name?.charAt(0) || 'U'}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900">{review.user?.name || 'Anonymous User'}</h4>
                                                <div className="flex gap-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            size={12}
                                                            className={`${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200'}`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            {isOwner && (
                                                <>
                                                    <button
                                                        onClick={() => handleEdit(review)}
                                                        className="p-2 transition-colors text-slate-400 hover:text-emerald-600 rounded-lg hover:bg-emerald-50"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteClick(review._id)}
                                                        className="p-2 transition-colors text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <p className="leading-relaxed text-slate-600 italic">
                                        &quot;{review.review}&quot;
                                    </p>
                                    <div className="mt-4 text-[10px] font-medium uppercase tracking-widest text-slate-400">
                                        {new Date(review.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                    </div>
                                </motion.div>
                            );
                        })
                    ) : (
                        <div className="py-20 text-center bg-slate-50/50 rounded-[3rem] border border-dashed border-slate-200">
                            <p className="text-slate-400">No reviews yet. Be the first to share your experience!</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>


            <AnimatePresence>
                {deleteModal.isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-sm p-6 bg-white shadow-2xl rounded-3xl"
                        >
                            <h3 className="mb-2 text-xl font-bold text-center text-slate-900">Delete Review?</h3>
                            <p className="mb-6 text-sm text-center text-slate-500">
                                Are you sure you want to delete your comment ?
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setDeleteModal({ isOpen: false, reviewId: null })}
                                    className="flex-1 py-3 font-bold text-slate-700 transition-colors bg-slate-100 rounded-xl hover:bg-slate-200"
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
