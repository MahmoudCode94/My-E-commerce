const BASE_URL = 'https://ecommerce.routemisr.com/api/v1/auth';

export interface RegisterValues {
    name: string;
    email: string;
    password: string;
    rePassword: string;
    phone: string;
}

export async function registerUser(userData: RegisterValues) {
    try {
        const response = await fetch(`${BASE_URL}/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Auth Error:", error);
        throw error;
    }
}

export interface LoginValues {
    email: string;
    password: string;
}

export async function loginUser(userData: LoginValues) {
    try {
        const response = await fetch('https://ecommerce.routemisr.com/api/v1/auth/signin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });
        return await response.json();
    } catch (error) {
        throw error;
    }
}

export async function forgotPassword(email: string) {
    const res = await fetch('https://ecommerce.routemisr.com/api/v1/auth/forgotPasswords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
    });
    return res.json();
}

export async function verifyResetCode(resetCode: string) {
    const res = await fetch('https://ecommerce.routemisr.com/api/v1/auth/verifyResetCode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resetCode })
    });
    return res.json();
}

export async function resetPassword(userData: object) {
    const res = await fetch('https://ecommerce.routemisr.com/api/v1/auth/resetPassword', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    });
    return res.json();
}

export async function changeUserPassword(passwords: object) {
    const token = localStorage.getItem('userToken');
    const res = await fetch('https://ecommerce.routemisr.com/api/v1/users/changeMyPassword', {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            'token': token || ''
        },
        body: JSON.stringify(passwords)
    });
    return res.json();
}

export async function updateUserData(values: object) {
    const token = localStorage.getItem('userToken');
    const res = await fetch('https://ecommerce.routemisr.com/api/v1/users/updateMe/', {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            'token': token || '' 
        },
        body: JSON.stringify(values)
    });
    return res.json();
}

export async function verifyToken() {
    const token = localStorage.getItem('userToken');
    if (!token) return null;

    const res = await fetch('https://ecommerce.routemisr.com/api/v1/auth/verifyToken', {
        method: 'GET',
        headers: { 
            'token': token 
        }
    });
    return res.json();
}

