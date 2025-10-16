// eslint.config.js
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ใช้ compat สำหรับแปลง config เดิมจาก "extends"
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  // ดึง base config ของ Next.js
  ...compat.extends("next/core-web-vitals"),

  // ✅ กำหนด ignore files
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },

  // ✅ ตั้งค่าหลักที่รวมจาก eslintConfig เดิม
  {
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      globals: {
        process: "readonly",
        module: "writable",
        require: "readonly",
        console: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": require("@typescript-eslint/eslint-plugin"),
    },
    rules: {
      camelcase: "off",
      quotes: "off",
      eqeqeq: "warn",
      "no-multi-spaces": "error",
      "no-unused-vars": "off",
      "space-infix-ops": "error",
      "object-curly-spacing": ["error", "always"],
      "@typescript-eslint/quotes": [
        "error",
        "single",
        { avoidEscape: true, allowTemplateLiterals: true },
      ],
      semi: ["error", "never"],
      "@typescript-eslint/no-unused-vars": "error",
      "space-before-function-paren": "off",
      "@typescript-eslint/space-before-function-paren": ["error", "never"],
      indent: "off",
      "@typescript-eslint/indent": [
        "error",
        2,
        {
          SwitchCase: 1,
          MemberExpression: 1,
          ArrayExpression: 1,
          ObjectExpression: 1,
          ImportDeclaration: 1,
          ignoreComments: false,
        },
      ],
      "no-trailing-spaces": "error",
      "no-multiple-empty-lines": ["error", { max: 1 }],
      "eol-last": ["error", "always"],
      "@typescript-eslint/comma-dangle": "error",
      "padding-line-between-statements": [
        "error",
        { blankLine: "always", prev: "function", next: "function" },
        { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
        {
          blankLine: "any",
          prev: ["const", "let", "var"],
          next: ["const", "let", "var"],
        },
        { blankLine: "always", prev: "multiline-block-like", next: "*" },
        { blankLine: "always", prev: "*", next: "multiline-block-like" },
        { blankLine: "always", prev: "*", next: "if" },
        { blankLine: "always", prev: "if", next: "*" },
      ],
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-empty-interface": "off",
      "@typescript-eslint/explicit-function-return-type": [
        "off",
        {
          allowExpressions: true,
          allowTypedFunctionExpressions: true,
          allowHigherOrderFunctions: true,
        },
      ],
      "@typescript-eslint/type-annotation-spacing": "error",
      "no-extra-semi": "error",
      "quote-props": ["error", "as-needed"],
    },
  },
];