const baseUrl = 'https://ecommerce.routemisr.com/api/v1/wishlist';

export async function getWishlist() {
    const res = await fetch(baseUrl, {
        method: 'GET',
        headers: {
            'token': localStorage.getItem('userToken') || ''
        }
    });
    return res.json();
}

export async function addToWishlist(productId: string) {
    const res = await fetch(baseUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'token': localStorage.getItem('userToken') || ''
        },
        body: JSON.stringify({ productId })
    });
    return res.json();
}

export async function removeFromWishlist(productId: string) {
    const res = await fetch(`${baseUrl}/${productId}`, {
        method: 'DELETE',
        headers: {
            'token': localStorage.getItem('userToken') || ''
        }
    });
    return res.json();
}