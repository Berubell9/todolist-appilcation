// eslint.config.js  (CommonJS)
const path = require("node:path");
const { FlatCompat } = require("@eslint/eslintrc");

const compat = new FlatCompat({
  baseDirectory: __dirname, // ให้ compat หา extends/plugins ได้ถูกจาก root
});

module.exports = [
  // base ของ ESLint เอง (optional แต่แนะนำ)
  ...compat.extends("eslint:recommended"),

  // base rule ของ Next.js
  ...compat.extends("next/core-web-vitals"),

  // ไม่ต้อง lint ไฟล์ build
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },

  // กฎหลัก (ย้ายมาจากของเดิมที่อยู่ใน package.json)
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        // ถ้ามีการอ้างถึงพวกนี้ในโค้ดฝั่ง server
        process: "readonly",
        module: "writable",
        require: "readonly",
        console: "readonly",
      },
    },
    rules: {
      camelcase: "off",
      quotes: "off",
      eqeqeq: "warn",
      "no-multi-spaces": "error",
      "no-unused-vars": "off",
      "space-infix-ops": "error",
      "object-curly-spacing": ["error", "always"],
      semi: ["error", "never"],
      "no-trailing-spaces": "error",
      "no-multiple-empty-lines": ["error", { max: 1 }],
      "eol-last": ["error", "always"],
      "quote-props": ["error", "as-needed"],
      "padding-line-between-statements": [
        "error",
        { blankLine: "always", prev: "function", next: "function" },
        { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
        { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] },
        { blankLine: "always", prev: "multiline-block-like", next: "*" },
        { blankLine: "always", prev: "*", next: "multiline-block-like" },
        { blankLine: "always", prev: "*", next: "if" },
        { blankLine: "always", prev: "if", next: "*" },
      ],
    },
  },
];