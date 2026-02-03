import { Product } from "./products.api";

export interface Category {
    _id: string;
    name: string;
    slug: string;
    image: string;
}

export async function getCategories(): Promise<Category[]> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
        const response = await fetch('https://ecommerce.routemisr.com/api/v1/categories', {
            method: 'GET',
            next: { 
                revalidate: 60, 
                tags: ['categories-list'] 
            },
            signal: controller.signal // إضافة الـ signal للتحكم في الـ timeout
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const res = await response.json();
        return res.data || [];

    } catch (error: unknown) {
        clearTimeout(timeoutId);
        if (error instanceof Error && error.name === 'AbortError') {
            throw new Error("Request Timeout: السيرفر تأخر في الرد");
        }
        throw error;
    }
}

export async function getSpecificCategory(id: string): Promise<Category> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
        const response = await fetch(`https://ecommerce.routemisr.com/api/v1/categories/${id}`, {
            method: 'GET',
            next: { 
                revalidate: 60,
                tags: [`category-${id}`] 
            },
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error("Category not found");
        }

        const res = await response.json();
        return res.data;

    } catch (error: unknown) {
        clearTimeout(timeoutId);
        if (error instanceof Error && error.name === 'AbortError') {
            throw new Error("Request Timeout");
        }
        throw error;
    }
}