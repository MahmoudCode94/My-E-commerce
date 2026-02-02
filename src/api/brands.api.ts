export interface Brand {
    _id: string;
    name: string;
    slug: string;
    image: string;
}

export async function getBrands(): Promise<Brand[]> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
        const response = await fetch('https://ecommerce.routemisr.com/api/v1/brands', {
            method: 'GET',
            next: { 
                revalidate: 60, 
                tags: ['brands-list'] 
            },
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) throw new Error("Failed to fetch brands");

        const res = await response.json();
        return res.data || [];

    } catch (error) {
        clearTimeout(timeoutId);
        console.error(error);
        return [];
    }
}
export async function getSpecificBrand(id: string): Promise<Brand> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
        const response = await fetch(`https://ecommerce.routemisr.com/api/v1/brands/${id}`, {
            method: 'GET',
            next: { revalidate: 60 },
            signal: controller.signal
        });

        clearTimeout(timeoutId);
        if (!response.ok) throw new Error("Brand not found");

        const res = await response.json();
        return res.data;
    } catch (error) {
        clearTimeout(timeoutId);
        throw error;
    }
}