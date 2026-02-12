import Cookies from 'js-cookie';

export const getAuthHeaders = (withToken = true): Record<string, string> => {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json'
    };

    if (withToken) {
        const token = Cookies.get('userToken');
        if (token) {
            headers['token'] = token;
        }
    }
    return headers;
};
