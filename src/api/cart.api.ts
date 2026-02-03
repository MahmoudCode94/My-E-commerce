const BASE_URL = 'https://ecommerce.routemisr.com/api/v1/cart';

export const addProductToCart = async (productId: string) => {
    const res = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'token': localStorage.getItem('userToken') || ''
        },
        body: JSON.stringify({ productId })
    });
    return res.json();
};

export const getUserCart = async () => {
    const res = await fetch(BASE_URL, {
        headers: { 'token': localStorage.getItem('userToken') || '' }
    });
    return res.json();
};

export const updateProductCount = async (productId: string, count: number) => {
    const res = await fetch(`${BASE_URL}/${productId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'token': localStorage.getItem('userToken') || ''
        },
        body: JSON.stringify({ count })
    });
    return res.json();
};

export const removeCartItem = async (productId: string) => {
    const res = await fetch(`${BASE_URL}/${productId}`, {
        method: 'DELETE',
        headers: { 'token': localStorage.getItem('userToken') || '' }
    });
    return res.json();
};

export const clearUserCart = async () => {
    const res = await fetch(BASE_URL, {
        method: 'DELETE',
        headers: { 'token': localStorage.getItem('userToken') || '' }
  });
  return res.json();
};