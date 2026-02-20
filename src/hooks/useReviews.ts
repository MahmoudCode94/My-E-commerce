import { useState, useCallback, useEffect, useMemo } from 'react';
import { getReviewsForProduct, createReview, updateReview, deleteReview, Review } from '@/api/reviews.api';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { ApiError } from '@/lib/api-client';

export function useReviews(productId: string) {
    const { isLoggedIn, userId, userName } = useAuth();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    const sortedReviews = useMemo(() => {
        if (!reviews.length) return [];
        const myReviewIndex = reviews.findIndex(r => r.user?._id === userId);
        if (myReviewIndex === -1) return reviews;
        const myReview = reviews[myReviewIndex];
        const otherReviews = reviews.filter((_, idx) => idx !== myReviewIndex);
        return [myReview, ...otherReviews];
    }, [reviews, userId]);

    const userHasReviewed = useMemo(() => {
        return reviews.some(r => r.user?._id === userId);
    }, [reviews, userId]);

    const addReview = async (reviewText: string, rating: number) => {
        if (!isLoggedIn) {
            toast.error('Please login to leave a review');
            return;
        }
        setIsSubmitting(true);
        try {
            const res = await createReview(productId, { review: reviewText, rating });
            const newReview = {
                ...res.data,
                user: { _id: userId!, name: userName!, email: '' }
            };
            setReviews(prev => [newReview, ...prev]);
            toast.success('Review posted! 🎉');
            return true;
        } catch (error: any) {
            toast.error(error.message || 'Failed to post review');
            return false;
        } finally {
            setIsSubmitting(false);
        }
    };

    const editReview = async (reviewId: string, reviewText: string, rating: number) => {
        setIsSubmitting(true);
        try {
            const res = await updateReview(reviewId, { review: reviewText, rating });
            setReviews(prev => prev.map(r => r._id === reviewId ? { ...res.data, user: r.user } : r));
            toast.success('Review updated! ✨');
            return true;
        } catch (error: any) {
            toast.error(error.message || 'Failed to update review');
            return false;
        } finally {
            setIsSubmitting(false);
        }
    };

    const removeReview = async (reviewId: string) => {
        // Optimistic update
        setReviews(prev => prev.filter(r => r._id !== reviewId));
        try {
            await deleteReview(reviewId);
            toast.success('Review deleted');
        } catch (error: any) {
            toast.error(error.message || 'Delete failed');
            loadReviews(); // Revert if failed
        }
    };

    return {
        reviews: sortedReviews,
        isLoading,
        isSubmitting,
        userHasReviewed,
        addReview,
        editReview,
        removeReview,
        isLoggedIn,
        userId
    };
}
