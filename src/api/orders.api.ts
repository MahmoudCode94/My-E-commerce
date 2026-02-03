interface ShippingAddress {
  details: string;
  phone: string;
  city: string;
}

interface OrderResponse {
  status: string;
  data: {
    _id: string;
    totalOrderPrice: number;
    paymentMethodType: string;
    isPaid: boolean;
    isDelivered: boolean;
    // يمكنك إضافة المزيد من الحقول إذا كنت ستحتاجها في الـ UI
  };
  message?: string;
}

export async function createCashOrder(
  cartId: string, 
  shippingAddress: ShippingAddress
): Promise<OrderResponse> {
  const token = typeof window !== "undefined" ? localStorage.getItem("userToken") : null;

  try {
    const response = await fetch(`https://ecommerce.routemisr.com/api/v1/orders/${cartId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: token || "",
      },
      body: JSON.stringify({ shippingAddress }),
    });

    const data: OrderResponse = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to create order");
    }

    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error.message;
    }
    throw "An error occurred while processing your order";
  }
}