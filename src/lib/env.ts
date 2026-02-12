export const env = {
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
};

const requiredEnvVars = [
    'NEXT_PUBLIC_BASE_URL',
] as const;

export function validateEnv() {
    for (const key of requiredEnvVars) {
        if (!process.env[key]) {
            console.error(`❌ Missing environment variable: ${key}`);
            if (process.env.NODE_ENV === 'production') {
                throw new Error(`Missing environment variable: ${key}`);
            }
        }
    }
}
