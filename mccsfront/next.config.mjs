/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        API: 'http://localhost:8080/api',
        LEADERBOARD: 'http://localhost:8080/api/leader',
        USER: 'http://localhost:8080/api/user',
        AUTH: 'http://localhost:8080/api/auth',
        REQUEST: 'http://localhost:8080/api/requests'
    },
};

export default nextConfig;
