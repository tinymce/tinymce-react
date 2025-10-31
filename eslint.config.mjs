import tinyPlugin from '@tinymce/eslint-plugin';
import { defineConfig } from "eslint/config";

export default defineConfig([
    tinyPlugin.configs.editor,
    {
        files: ["**/*.ts", "**/*.tsx"],
        languageOptions: {
            ecmaVersion: 5,
            sourceType: "module",

            parserOptions: {
                project: "tsconfig.json",
            },
        },

        rules: {
            "@tinymce/prefer-fun": "off",
            "@typescript-eslint/no-unsafe-argument": "off",
        },
    },
    {
        files: ["src/test/**/*"],

        rules: {
            "@typescript-eslint/no-unused-vars": ["warn", {
                argsIgnorePattern: "^_",
            }],

            "no-var": "off",
        },
    }
]);