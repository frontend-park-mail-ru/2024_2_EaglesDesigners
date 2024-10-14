import globals from "globals";
import ts from "typescript";

export default [
    ts.configs.recommended,
    {
        rules: {
            semi: ["warn", "always"],
            quotes: "off",
        },
    },
    {
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "module",
            globals: {
                ...globals.browser,
                ...globals.node,
                myCustomGlobal: "readonly",
                Handlebars: "readonly"
            }
        },
    },
    {
        ignores: ["**/*precompiled.js"],
    },
    
    
];