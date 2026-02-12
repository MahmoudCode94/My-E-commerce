import Cookies from "js-cookie";

const BASE_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/addresses`;

const getHeaders = () => {
  const token = Cookies.get("userToken");

  return {
    "Content-Type": "application/json",
    "token": token || "",
  };
};

async function handleRequest(url: string, options: RequestInit) {
  const res = await fetch(url, options);
  const data = await res.json();

  if (res.status === 401) {
    console.error("Unauthorized: Token might be invalid or expired");
  }

  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

export const getAllAddresses = () =>
  handleRequest(BASE_URL, {
    method: "GET",
    headers: getHeaders(),
    cache: 'no-store'
  });

export const addAddress = (formData: object) =>
  handleRequest(BASE_URL, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(formData),
  });

export const deleteAddress = (id: string) =>
  handleRequest(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });