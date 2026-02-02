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
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
        const response = await fetch('https://ecommerce.routemisr.com/api/v1/products', {
            method: 'GET',
            next: { 
                revalidate: 60,
                tags: ['products-list'] 
            },
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

        if (error instanceof Error) {
            throw error;
        }

        throw new Error("حدث خطأ غير متوقع");
    }
}

export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
    try {
        const response = await fetch(
            `https://ecommerce.routemisr.com/api/v1/products?category[in]=${categoryId}`, 
            {
                next: { revalidate: 60 }
            }
        );
        const res = await response.json();
        return res.data || [];
    } catch (error) {
        console.error(error);
        return [];
    }
}