export interface SubCategory {
    _id: string;
    name: string;
    category: string;
    slug: string;
}

export interface CategoryInProduct {
    _id: string;
    name: string;
    slug: string;
    image: string;
}

export interface Product {
    _id: string;
    id: string;
    title: string;
    imageCover: string;
    images: string[];
    description: string;
    price: number;
    ratingsAverage: number;
    category: CategoryInProduct;
    subcategory: SubCategory[];
}

import { fetchWithRetry } from "@/lib/api-client";

export async function getProducts(): Promise<Product[]> {
    try {
        const response = await fetchWithRetry(`${process.env.NEXT_PUBLIC_BASE_URL}/products`, {
            method: 'GET',
            cache: 'no-store',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const res = await response.json();
        return res.data || [];
    } catch (error) {
        return [];
    }
}

export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
    try {
        const response = await fetchWithRetry(
            `${process.env.NEXT_PUBLIC_BASE_URL}/products?category[in]=${categoryId}`,
            {
                next: { revalidate: 60 },
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        const res = await response.json();
        return res.data || [];
    } catch (error) {
        return [];
    }
}

export async function getSpecificProduct(id: string): Promise<Product | null> {
    try {
        const response = await fetchWithRetry(`${process.env.NEXT_PUBLIC_BASE_URL}/products/${id}`, {
            next: { revalidate: 60, tags: [`product-${id}`] }
        });

        if (!response.ok) return null;

        const res = await response.json();
        return res.data;
    } catch (error) {
        return null;
    }
}
