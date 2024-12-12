import { defineConfig } from "vite";
import { resolve } from "path";
import autoprefixer from "autoprefixer";
import rollupTs from 'rollup-plugin-typescript2';
import dtsBundle from "rollup-plugin-dts-bundle";



const OUT_DIR = resolve(__dirname, "../_dist/luff-comp");

export default defineConfig({
    plugins: [
        {
            ...rollupTs({
                check: true,
                tsconfig: './tsconfig.json',
                tsconfigOverride: {
                    noEmits: true,
                    declarationDir: "./d",
                    exclude: ["vite.config.ts"],
                    outDir: "d"
                },

            }),
            // run before build
            enforce: 'pre',
        },
        dtsBundle({
            bundle: {
                name: 'luff-comp',
                main: '../_dist/luff-comp/index.d.ts',
                out: 'index.d.ts', // can be omitted, 'typings.d.ts' - default output.
                // Other 'dts-bundle' package options.
                removeSource: true,

            },
            // deleteOnComplete: [
            //     '../_dist/luff/Core',
            // ],
        })
    ],

    build: {

        assetsInlineLimit: 0,
        copyPublicDir: false,
        sourcemap: true,
        lib: {
            entry: resolve(__dirname, "./src/index.tsx"),
            name: 'luff-comp',
            formats: ["es"]
        },
        rollupOptions: {
            external: ["luff"],
            output: {
                dir: OUT_DIR,
                entryFileNames: "index.js",
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name == 'style.css')
                        return 'index.css';
                    return assetInfo.name;
                },

            },
        },
    },
    esbuild: {
        //minifyWhitespace: true,
        minifyIdentifiers: false,
        keepNames: true,
        jsxFactory: "Luff.createElement",
        jsxFragment: "Luff.Fragment",
    },
    css: {
        preprocessorOptions: {
            scss: {
                api: "modern-compiler", // "modern", "modern-compiler" or "legacy"
            },
        },
        postcss: {
            plugins: [
                autoprefixer,
            ]
        }

    },
    resolve: {
        alias: {
            //src: resolve(__dirname, "src"),
            luff: resolve(__dirname, "./node_modules/luff"),
        },
    },

    preview: {
        port: 3003,
        host: true,
        cors: false,
        proxy: {
            "/api": {
                target: "http://localhost:8002",
                changeOrigin: true,
                secure: false,
            },
        },
    },
    server: {
        port: 3004,
        host: true,
        cors: false,
        proxy: {
            "/api": {
                target: "http://localhost:8004",
                changeOrigin: true,
                secure: false,
            },
        },
    },
});
