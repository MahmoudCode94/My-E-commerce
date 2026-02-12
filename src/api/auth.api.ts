import Cookies from "js-cookie";

import { fetchWithRetry } from "@/lib/api-client";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export interface RegisterValues { name: string; email: string; password: string; rePassword: string; phone: string; }
export interface LoginValues { email: string; password: string; }
export interface ChangePasswordValues { currentPassword?: string; password?: string; rePassword?: string; }
export interface UpdateUserValues { name?: string; email?: string; phone?: string; }

export interface AuthResponse {
    message: string;
    status?: string;
    statusMsg?: string;
    token?: string;
    user?: {
        name: string;
        email: string;
        role: string;
    };
}

export interface ResetPasswordData {
    email: string;
    newPassword: string;
}

import { getAuthHeaders } from "@/lib/auth-helper";



async function apiRequest<T>(
    endpoint: string,
    method: 'POST' | 'PUT' | 'GET',
    body?: object,
    withToken = false
): Promise<T> {

    const response = await fetchWithRetry(`${BASE_URL}${endpoint}`, {
        method,
        headers: getAuthHeaders(withToken),
        body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
    }

    return data as T;
}

export const registerUser = (userData: RegisterValues) =>
    apiRequest<AuthResponse>('/auth/signup', 'POST', userData);

export const loginUser = (userData: LoginValues) =>
    apiRequest<AuthResponse>('/auth/signin', 'POST', userData);

export const forgotPassword = (email: string) =>
    apiRequest<AuthResponse>('/auth/forgotPasswords', 'POST', { email });

export const verifyResetCode = (resetCode: string) =>
    apiRequest<AuthResponse>('/auth/verifyResetCode', 'POST', { resetCode });

export const resetPassword = (userData: ResetPasswordData) =>
    apiRequest<AuthResponse>('/auth/resetPassword', 'PUT', userData);

export const changeUserPassword = (passwords: ChangePasswordValues) =>
    apiRequest<AuthResponse>('/users/changeMyPassword', 'PUT', passwords, true);

export const updateUserData = (values: UpdateUserValues) =>
    apiRequest<AuthResponse>('/users/updateMe', 'PUT', values, true);

export const verifyToken = () =>
    apiRequest<AuthResponse>('/auth/verifyToken', 'GET', undefined, true);