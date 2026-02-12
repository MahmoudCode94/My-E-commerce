import { SubCategory } from "./products.api";

const BASE_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/categories`;

export interface Category {
    _id: string;
    name: string;
    slug: string;
    image: string;
}

import { fetchWithRetry } from "@/lib/api-client";

async function handleCategoryRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
    const response = await fetchWithRetry(url, options);
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    const res = await response.json();
    return res.data;
}

export const getCategories = (): Promise<Category[]> =>
    handleCategoryRequest<Category[]>(BASE_URL, {
        next: { revalidate: 60, tags: ['categories-list'] }
    }).catch(() => []);

export const getSpecificCategory = (id: string): Promise<Category> =>
    handleCategoryRequest<Category>(`${BASE_URL}/${id}`, {
        next: { revalidate: 60, tags: [`category-${id}`] }
    });

export const getCategorySubCategories = (id: string): Promise<SubCategory[]> =>
    handleCategoryRequest<SubCategory[]>(`${BASE_URL}/${id}/subcategories`)
        .catch(() => []);