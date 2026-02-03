export interface SubCategory {
    _id: string;
    name: string;
    category: string;
    slug: string;
}

export async function getSubCategories(): Promise<SubCategory[]> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
        const response = await fetch('https://ecommerce.routemisr.com/api/v1/subcategories', {
            method: 'GET',
            next: { 
                revalidate: 60,
                tags: ['subcategories-list'] 
            },
            signal: controller.signal
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
            throw new Error("Request Timeout");
        }

        console.error("Error fetching subcategories:", error);
        return [];
    }
}