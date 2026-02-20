export class ApiError extends Error {
    constructor(public message: string, public statusCode?: number, public endpoint?: string) {
        super(message);
        this.name = 'ApiError';
    }
}

export interface RequestOptions extends RequestInit {
    retries?: number;
    backoff?: number;
}

export async function fetchWithRetry(
    url: string,
    options: RequestOptions = {}
): Promise<Response> {
    const { retries = 3, backoff = 500, ...fetchOptions } = options;
    const timeout = 10000;
    fetchOptions.headers = {
        ...fetchOptions.headers,
    };

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeout);

        try {
            const response = await fetch(url, { ...fetchOptions, signal: controller.signal });
            clearTimeout(timer);

            if (response.status >= 500 && response.status <= 504 && attempt < retries) {
                // Server error, will retry
                throw new ApiError(`Server Error (${response.status})`, response.status, url);
            }

            return response;
        } catch (error: any) {
            lastError = error;

            if (attempt < retries) {
                const delay = backoff * Math.pow(2, attempt);
                // console.warn(`⚠️ Request failed to ${url}. Attempt ${attempt + 1}/${retries + 1}. Retrying in ${delay}ms...`);
                await new Promise((resolve) => setTimeout(resolve, delay));
            }
        }
    }

    throw lastError || new ApiError('Request failed after multiple retries', undefined, url);
}
