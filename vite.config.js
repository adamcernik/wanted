import { defineConfig } from 'vite';

export default defineConfig({
    server: {
        port: 8000,
        open: true,
    },
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        sourcemap: true,
        rollupOptions: {
            output: {
                manualChunks: {
                    i18n: ['./js/i18n.js'],
                    scroll: ['./js/modules/scroll.js'],
                },
            },
        },
    },
    css: {
        devSourcemap: true,
        preprocessorOptions: {
            css: {
                charset: false,
            },
        },
    },
    resolve: {
        alias: {
            '@css': '/css',
        },
    },
    optimizeDeps: {
        include: [],
    },
});
