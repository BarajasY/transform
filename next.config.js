/** @type {import('next').NextConfig} */
const nextConfig = {
    serverRuntimeConfig: {
        PROJECT_ROOT: __dirname
    },
    output: "export",
    images: {
        path: "/"
    }
}

module.exports = nextConfig
