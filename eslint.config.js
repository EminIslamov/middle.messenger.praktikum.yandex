import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";

export default [
  eslint.configs.recommended,
  ...tseslint.configs.strict,
  {
    ignores: [
      "**/*.js",
      "node_modules/**",
      "dist/**",
      "public/**",
      "*.config.js",
      "*.config.ts"
    ]
  },
  {
    rules: {
      "eol-last": ["error", "always"],
    },
  },
];
