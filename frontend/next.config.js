/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: 'loremflickr.com',
            },
            {
                hostname: 'picsum.photos',
            },
        ],
    },
};

module.exports = nextConfig;
