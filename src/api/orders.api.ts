import { getCookie } from "cookies-next";

export interface ShippingAddress {
  details: string;
  phone: string;
  city: string;
}

export interface OrderResponse {
  status: string;
  data: {
    _id: string;
    totalOrderPrice: number;
    paymentMethodType: string;
    isPaid: boolean;
    isDelivered: boolean;
  };
  message?: string;
}

export async function createCashOrder(
  cartId: string,
  shippingAddress: ShippingAddress
): Promise<OrderResponse> {
  const token = getCookie("userToken");

  try {
    const response = await fetch(`https://ecommerce.routemisr.com/api/v1/orders/${cartId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "token": (token as string) ?? "",
      },
      body: JSON.stringify({ shippingAddress }),
    });

    const data: OrderResponse = await response.json();

    if (!response.ok) throw new Error(data.message || "Failed to create order");

    return data;
  } catch (error: unknown) {
    if (error instanceof Error) throw error;
    throw new Error("An error occurred while processing your order");
  }
}