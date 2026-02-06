export interface SubCategory {
    _id: string;
    name: string;
    category: string;
    slug: string;
}

export async function getSubCategories(): Promise<SubCategory[]> {
    try {
        const response = await fetch('https://ecommerce.routemisr.com/api/v1/subcategories', {
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