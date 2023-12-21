const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_DEBUG === 'true' ? 'http://localhost:3000' : process.env.NEXT_PUBLIC_API_URL;

export {
    NEXT_PUBLIC_API_URL,
};
