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