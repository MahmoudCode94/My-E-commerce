import Cookies from 'js-cookie';

const BASE_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/cart`;

export interface CartProduct {
    _id: string;
    title: string;
    imageCover: string;
}

export interface CartItem {
    count: number;
    price: number;
    product: CartProduct;
}

export interface CartData {
    _id: string;
    totalCartPrice: number;
    products: CartItem[];
}

export interface CartResponse {
    status: string;
    message?: string;
    numOfCartItems?: number;
    data: CartData;
}

async function cartRequest(url: string, method: string, body?: object): Promise<CartResponse> {
    const token = Cookies.get('userToken');
    if (!token) throw new Error("You must be logged in");

    const res = await fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json',
            'token': token
        },
        body: body ? JSON.stringify(body) : undefined,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Server Error');
    return data as CartResponse;
}

export const addProductToCart = (productId: string) => cartRequest(BASE_URL, 'POST', { productId });
export const getUserCart = () => cartRequest(BASE_URL, 'GET');
export const updateProductCount = (productId: string, count: number) => cartRequest(`${BASE_URL}/${productId}`, 'PUT', { count });
export const removeCartItem = (productId: string) => cartRequest(`${BASE_URL}/${productId}`, 'DELETE');
export const clearUserCart = () => cartRequest(BASE_URL, 'DELETE');
export const applyCoupon = (coupon: string) => cartRequest(`${BASE_URL}/applyCoupon`, 'POST', { coupon });