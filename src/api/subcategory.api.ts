export interface SubCategory {
    _id: string;
    name: string;
    category: string;
    slug: string;
}

import { fetchWithRetry } from "@/lib/api-client";

export async function getSubCategories(): Promise<SubCategory[]> {
    try {
        const response = await fetchWithRetry(`${process.env.NEXT_PUBLIC_BASE_URL}/subcategories`, {
            method: 'GET',
            next: {
                revalidate: 60,
                tags: ['subcategories-list']
            }
        });

        if (!response.ok) {
            console.error(`Failed to fetch subcategories: ${response.status}`);
            return [];
        }

        const res = await response.json();
        return res.data || [];

    } catch (error) {
        console.error("Network or Parsing Error in getSubCategories:", error);
        return [];
    }
}