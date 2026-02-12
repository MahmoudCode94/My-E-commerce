const BASE_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/brands`;

export interface Brand {
    _id: string;
    name: string;
    slug: string;
    image: string;
}

import { fetchWithRetry } from "@/lib/api-client";

async function handleBrandRequest(url: string, options: RequestInit = {}) {
    const response = await fetchWithRetry(url, options);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const result = await response.json();
    return result.data;
}

export const getBrands = (): Promise<Brand[]> =>
    handleBrandRequest(BASE_URL, {
        next: { revalidate: 60, tags: ['brands-list'] }
    }).catch(() => []);

export const getSpecificBrand = (id: string): Promise<Brand> =>
    handleBrandRequest(`${BASE_URL}/${id}`, {
        next: { revalidate: 60 }
    });