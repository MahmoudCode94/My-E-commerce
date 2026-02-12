import Cookies from "js-cookie";
import { fetchWithRetry } from "@/lib/api-client";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export interface ReviewUser {
    _id: string;
    name: string;
    email: string;
}

export interface Review {
    _id: string;
    review: string;
    rating: number;
    user: ReviewUser;
    product: string;
    createdAt: string;
    updatedAt: string;
}

export interface ReviewsResponse {
    status: string;
    results?: number;
    data: Review[];
}

export interface ReviewResponse {
    status: string;
    data: Review;
    message?: string;
}

import { getAuthHeaders } from "@/lib/auth-helper";



export async function getReviewsForProduct(productId: string): Promise<ReviewsResponse> {
    const response = await fetchWithRetry(`${BASE_URL}/products/${productId}/reviews`, {
        method: 'GET',
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch reviews');
    return data;
}

export async function getAllReviews(): Promise<ReviewsResponse> {
    const response = await fetchWithRetry(`${BASE_URL}/reviews`, {
        method: 'GET',
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch reviews');
    return data;
}

export async function getSpecificReview(reviewId: string): Promise<ReviewResponse> {
    const response = await fetchWithRetry(`${BASE_URL}/reviews/${reviewId}`, {
        method: 'GET',
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch review');
    return data;
}

export async function createReview(productId: string, reviewData: { review: string, rating: number }): Promise<ReviewResponse> {
    const response = await fetchWithRetry(`${BASE_URL}/products/${productId}/reviews`, {
        method: 'POST',
        headers: getAuthHeaders(true),
        body: JSON.stringify(reviewData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to create review');
    return data;
}

export async function updateReview(reviewId: string, reviewData: { review: string, rating: number }): Promise<ReviewResponse> {
    const response = await fetchWithRetry(`${BASE_URL}/reviews/${reviewId}`, {
        method: 'PUT',
        headers: getAuthHeaders(true),
        body: JSON.stringify(reviewData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to update review');
    return data;
}

export async function deleteReview(reviewId: string): Promise<ReviewResponse> {
    const response = await fetchWithRetry(`${BASE_URL}/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(true),
    });

    if (response.status === 204) {
        return {} as ReviewResponse;
    }

    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    if (!response.ok) throw new Error(data.message || 'Failed to delete review');
    return data;
}
