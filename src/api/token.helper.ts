import { getCookie } from 'cookies-next';

export async function getToken() {
    return getCookie("userToken") as string | undefined;
}
