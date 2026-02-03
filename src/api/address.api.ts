const BASE_URL = "https://ecommerce.routemisr.com/api/v1/addresses";

const getHeaders = () => ({
  "Content-Type": "application/json",
  token: localStorage.getItem("userToken") || "",
});

export async function getAllAddresses() {
  const res = await fetch(BASE_URL, { headers: getHeaders() });
  return await res.json();
}

export async function addAddress(formData: object) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(formData),
  });
  return await res.json();
}

export async function deleteAddress(id: string) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  return await res.json();
}