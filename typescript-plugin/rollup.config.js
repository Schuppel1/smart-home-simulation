// rollup.config.js
import typescript from '@rollup/plugin-typescript';

export default {
    input: "./src/index.ts",
    output: {
        format: "iife",
        file: "/usr/share/nginx/html/js/bundle.js"
    },
    plugins: [
        typescript({
            tsconfig: "./tsconfig.json",
            noEmitOnError: true
        })
    ]
};