import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@components': path.resolve(__dirname, './src/components'),
            '@utils': path.resolve(__dirname, './src/utils'),
            '@trek-types': path.resolve(__dirname, './src/types'),
            '@assets': path.resolve(__dirname, './src/assets'),
            '@constants': path.resolve(__dirname, './src/constants'),
        },
    },
})
