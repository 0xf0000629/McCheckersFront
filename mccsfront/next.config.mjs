/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        API: 'http://localhost:8080/api',
        LEADERBOARD: 'http://localhost:8080/api/leader',
        USER: 'http://localhost:8080/api/users',
        AUTH: 'http://localhost:8080/api/auth',
        REQUEST: 'http://localhost:8080/api/requests',
        ADMIN: 'http://localhost:8080/admin',
    },
};

export default nextConfig;
