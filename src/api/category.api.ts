import { SubCategory } from "./products.api";

const BASE_URL = 'https://ecommerce.routemisr.com/api/v1/categories';

export interface Category {
    _id: string;
    name: string;
    slug: string;
    image: string;
}

async function fetchWithTimeout<T>(url: string, options: RequestInit = {}, timeout = 5000): Promise<T> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, { ...options, signal: controller.signal });
        clearTimeout(timer);

        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

        const res = await response.json();
        return res.data;
    } catch (error: unknown) {
        clearTimeout(timer);
        if (error instanceof Error) {
            if (error.name === 'AbortError') throw new Error("Request Timeout");
            throw error;
        }
        throw new Error("An unexpected error occurred");
    }
}

export const getCategories = (): Promise<Category[]> =>
    fetchWithTimeout<Category[]>(BASE_URL, {
        next: { revalidate: 60, tags: ['categories-list'] }
    }).catch(() => []);

export const getSpecificCategory = (id: string): Promise<Category> =>
    fetchWithTimeout<Category>(`${BASE_URL}/${id}`, {
        next: { revalidate: 60, tags: [`category-${id}`] }
    });
export const getCategorySubCategories = (id: string): Promise<SubCategory[]> =>
    fetchWithTimeout<SubCategory[]>(`${BASE_URL}/${id}/subcategories`)
    .catch(() => []);