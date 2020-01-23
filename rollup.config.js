import pkg from "./package.json";

const external = [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {})
];

export default [
    // CommonJS
    {
        input: "index.js",
        output: { file: "dist/cjs.js", format: "cjs", indent: false },
        external
    },

    // ES
    {
        input: "index.js",
        output: { file: "dist/esm.js", format: "es", indent: false },
        external
    }
];