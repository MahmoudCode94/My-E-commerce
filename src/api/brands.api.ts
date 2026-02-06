const BASE_URL = 'https://ecommerce.routemisr.com/api/v1/brands';

export interface Brand {
    _id: string;
    name: string;
    slug: string;
    image: string;
}

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeout = 8000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, { ...options, signal: controller.signal });
        clearTimeout(id);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const result = await response.json();
        return result.data;
    } catch (error) {
        clearTimeout(id);
        console.error("Fetch Error:", error);
        throw error;
    }
}

export const getBrands = (): Promise<Brand[]> => 
    fetchWithTimeout(BASE_URL, {
        next: { revalidate: 60, tags: ['brands-list'] }
    }).catch(() => []);

export const getSpecificBrand = (id: string): Promise<Brand> => 
    fetchWithTimeout(`${BASE_URL}/${id}`, {
        next: { revalidate: 60 }
    });