import { defineConfig, globalIgnores } from "eslint/config";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([globalIgnores(["projects/**/*"]), {
    plugins: {
        "@typescript-eslint": typescriptEslint,
    },

    languageOptions: {
        globals: {
            $localize: "readonly",
            localStorage: "readonly",
        },
    },
}, {
    files: ["**/*.ts"],

    extends: compat.extends(
        "plugin:eslint-plugin-prettier/recommended",
        "plugin:@angular-eslint/recommended",
        "plugin:@angular-eslint/template/process-inline-templates",
        "standard",
    ),

    languageOptions: {
        ecmaVersion: 5,
        sourceType: "script",

        parserOptions: {
            project: ["tsconfig.json", "e2e/tsconfig.json"],
            createDefaultProgram: true,
        },
    },

    rules: {
        "@angular-eslint/component-class-suffix": ["error", {
            suffixes: ["Page", "Component"],
        }],

        "@angular-eslint/component-selector": ["error", {
            type: "element",
            prefix: "qbit",
            style: "kebab-case",
        }],

        "@angular-eslint/directive-selector": ["error", {
            type: "attribute",
            prefix: "qbit",
            style: "camelCase",
        }],

        "@typescript-eslint/member-delimiter-style": "off",
        "@typescript-eslint/semi": "off",
        "@typescript-eslint/no-underscore-dangle": "off",
        "@typescript-eslint/no-empty-interface": "off",
        curly: "off",
        "no-useless-constructor": "off",
        "@ngrx/prefer-effect-callback-in-block-statement": "off",
        "@typescript-eslint/explicit-function-return-type": "error",
        "@typescript-eslint/explicit-member-accessibility": "error",
        "space-before-function-paren": ["error", "never"],
        "require-await": "error",
        "no-underscore-dangle": "off",

        "no-empty-function": ["error", {
            allow: ["constructors"],
        }],

        "dot-notation": "off",
        "@typescript-eslint/dot-notation": "off",
        "accessor-pairs": "off",
        "no-unused-vars": "off",

        "@typescript-eslint/no-unused-vars": ["error", {
            argsIgnorePattern: "^_",
        }],

        "lines-between-class-members": ["error", {
            enforce: [{
                blankLine: "always",
                prev: "*",
                next: "method",
            }],
        }],
    },
}, {
    files: ["**/*.spec.ts"],

    rules: {
        "no-undef": "off",
        "no-empty-function": "off",

        "space-before-function-paren": ["error", {
            anonymous: "never",
            named: "never",
            asyncArrow: "ignore",
        }],
    },
}, {
    files: ["**/*.selectors.ts", "**/*.reducer.ts"],

    rules: {
        "@typescript-eslint/explicit-function-return-type": "off",
    },
}, {
    files: ["**/environment.ts"],

    rules: {
        "max-len": "off",
        "@typescript-eslint/naming-convention": "off",
    },
}, {
    files: ["**/*.html"],

    extends: compat.extends(
        "plugin:eslint-plugin-prettier/recommended",
        "plugin:@angular-eslint/template/recommended",
    ),

    rules: {},
}]);