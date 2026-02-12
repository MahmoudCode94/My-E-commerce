import Cookies from "js-cookie";
import { fetchWithRetry } from "@/lib/api-client";

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

async function wishlistRequest(url: string, options: RequestInit = {}): Promise<WishlistResponse> {
  const headers = getHeaders();
  if (!headers) throw new Error("Authentication required");

  const res = await fetchWithRetry(url, {
    ...options,
    headers: {
      ...headers,
      ...options.headers
    }
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Wishlist operation failed");

  return data;
}

export const getWishlist = async (): Promise<WishlistResponse> => {
  try {
    return await wishlistRequest(baseUrl, {
      method: 'GET',
      cache: 'no-store'
    });
  } catch (error) {
    return { status: "error", data: [] };
  }
};

export async function addToWishlist(productId: string): Promise<WishlistResponse> {
  try {
    return await wishlistRequest(baseUrl, {
      method: 'POST',
      body: JSON.stringify({ productId })
    });
  } catch (error: any) {
    return { status: "error", data: [], message: error.message };
  }
}

export async function removeFromWishlist(productId: string): Promise<WishlistResponse> {
  try {
    return await wishlistRequest(`${baseUrl}/${productId}`, {
      method: 'DELETE'
    });
  } catch (error: any) {
    return { status: "error", data: [], message: error.message };
  }
}
