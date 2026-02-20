import { getCookie } from 'cookies-next';

export const getAuthHeaders = (withToken = true): Record<string, string> => {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json'
    };

    if (withToken) {
        const token = getCookie('userToken');
        if (token) {
            headers['token'] = token as string;
        }
    }
    return headers;
};
