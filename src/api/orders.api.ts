export async function createCashOrder(cartId: string, shippingAddress: { details: string; phone: string; city: string }) {
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

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to create order");
    }

    return data;
  } catch (error: any) {
    throw error.message || "An error occurred while processing your order";
  }
}