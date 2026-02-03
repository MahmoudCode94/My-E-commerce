const baseUrl = 'https://ecommerce.routemisr.com/api/v1/wishlist';

export interface WishlistItem {
  _id: string;
  title: string;
  price: number;
  imageCover: string;
  ratingsAverage: number;
  id: string;
}

export interface WishlistResponse {
  status: string;
  count?: number;
  data: WishlistItem[];
  message?: string;
}

const getHeaders = () => {
  const token = typeof window !== "undefined" ? localStorage.getItem('userToken') : '';
  return {
    'Content-Type': 'application/json',
    'token': token || ''
  };
};

export const getWishlist = async (): Promise<WishlistResponse> => {
  const res = await fetch(baseUrl, {
    headers: getHeaders()
  });
  return res.json();
};

export async function addToWishlist(productId: string): Promise<WishlistResponse> {
  const res = await fetch(baseUrl, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ productId })
  });
  return res.json();
}

export async function removeFromWishlist(productId: string): Promise<WishlistResponse> {
  const res = await fetch(`${baseUrl}/${productId}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  return res.json();
}