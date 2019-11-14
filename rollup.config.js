import nodeResolve from "rollup-plugin-node-resolve";
import babel from "rollup-plugin-babel";
import replace from "rollup-plugin-replace";
import { terser } from "rollup-plugin-terser";

import pkg from "./package.json";

const external = [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {})
];

const plugins = [
    babel({
        exclude: "node_modules/**"
    }),
]

export default [
    // CommonJS
    {
        input: "index.js",
        output: { file: "dist/cjs.js", format: "cjs", indent: false },
        external,
        plugins
    },

    // ES
    {
        input: "index.js",
        output: { file: "dist/esm.js", format: "es", indent: false },
        external,
        plugins
    },

    // UMD Development
    {
        input: "index.js",
        output: {
            file: "dist/umd.js",
            format: "umd",
            name: "SagaSliceTool",
            indent: false
        },
        external,
        plugins: [nodeResolve()].concat(plugins, [

            replace({
                "process.env.NODE_ENV": JSON.stringify("development")
            })
        ])
    },

    // UMD Production
    {
        input: "index.js",
        output: {
            file: "dist/umd.min.js",
            format: "umd",
            name: "SagaSliceTool",
            indent: false
        },
        external,
        plugins: [nodeResolve()].concat(plugins, [

            replace({
                "process.env.NODE_ENV": JSON.stringify("development")
            }),
            terser({
                compress: {
                    pure_getters: true,
                    unsafe: true,
                    unsafe_comps: true,
                    warnings: false
                }
            })
        ])
    }
];