export interface SubCategory {
    _id: string;
    name: string;
    category: string;
    slug: string;
}

export interface CategoryInProduct {
    _id: string;
    name: string;
    slug: string;
    image: string;
}

export interface Product {
    _id: string;
    id: string;
    title: string;
    imageCover: string;
    description: string;
    price: number;
    ratingsAverage: number;
    category: CategoryInProduct;
    subcategory: SubCategory[];
}

export async function getProducts(): Promise<Product[]> {
    try {
        const response = await fetch('https://ecommerce.routemisr.com/api/v1/products', {
            method: 'GET',
            cache: 'no-store',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const res = await response.json();
        return res.data || [];
    } catch (error) {
        console.error("Server Side Fetch Error:", error);
        return [];
    }
}

export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
    try {
        const response = await fetch(
            `https://ecommerce.routemisr.com/api/v1/products?category[in]=${categoryId}`,
            { 
                next: { revalidate: 60 },
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            }
        );
        const res = await response.json();
        return res.data || [];
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function getSpecificProduct(id: string): Promise<Product | null> {
    try {
        const response = await fetch(`https://ecommerce.routemisr.com/api/v1/products/${id}`, {
            next: { revalidate: 60, tags: [`product-${id}`] }
        });

        if (!response.ok) return null;

        const res = await response.json();
        return res.data;
    } catch (error) {
        console.error("Error fetching product details:", error);
        return null;
    }
}