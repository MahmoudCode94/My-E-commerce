export interface Product {
    _id: string;
    id: string;
    title: string;
    imageCover: string;
    description: string;
    price: number;
    ratingsAverage: number;
}

export async function getProducts(): Promise<Product[]> {
    try {
        const response = await fetch('https://ecommerce.routemisr.com/api/v1/products');

        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }

        const res = await response.json();
        return res.data || [];
    } catch (error) {
        console.error("Fetch error:", error);
        return [];
    }
}