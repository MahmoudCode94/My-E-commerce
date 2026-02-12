import Cookies from "js-cookie";

const baseUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/wishlist`;

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
  const token = Cookies.get('userToken');
  if (!token) return null;
  return {
    'Content-Type': 'application/json',
    'token': token
  };
};

export const getWishlist = async (): Promise<WishlistResponse> => {
  try {
    const headers = getHeaders();
    if (!headers) return { status: "error", data: [], message: "No token found" };

    const res = await fetch(baseUrl, {
      headers,
      cache: 'no-store'
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch wishlist");

    return data;
  } catch (error) {
    return { status: "error", data: [] };
  }
};

export async function addToWishlist(productId: string): Promise<WishlistResponse> {
  try {
    const headers = getHeaders();
    if (!headers) throw new Error("Authentication required");

    const res = await fetch(baseUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({ productId: productId })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to add product");

    return data;
  } catch (error: any) {
    return { status: "error", data: [], message: error.message };
  }
}

export async function removeFromWishlist(productId: string): Promise<WishlistResponse> {
  try {
    const headers = getHeaders();
    if (!headers) throw new Error("Authentication required");

    const res = await fetch(`${baseUrl}/${productId}`, {
      method: 'DELETE',
      headers
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to remove product");

    return data;
  } catch (error: any) {
    return { status: "error", data: [], message: error.message };
  }
}
