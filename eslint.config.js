import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";

export default [
  eslint.configs.recommended,
  ...tseslint.configs.strict,
  { ignores: ["**/*.js"] },
  {
    rules: {
      "eol-last": ["error", "always"],
    },
  },
];
