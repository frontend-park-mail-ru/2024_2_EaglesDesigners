import globals from "globals";
import js from "@eslint/js";
//import customConfig from "./custom-config.js";
//import myConfig from "eslint-config-my-config";

export default [
    js.configs.recommended,
   // myConfig,
    {
        rules: {
            semi: ["warn", "always"]
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
    
    
]