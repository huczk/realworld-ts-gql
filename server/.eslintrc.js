module.exports = {
  parser: "@typescript-eslint/parser",
  extends: [
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "plugin:@typescript-eslint/recommended",
    "prettier/@typescript-eslint",
    "plugin:prettier/recommended",
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
  },
  rules: {
    "@typescript-eslint/interface-name-prefix": 0,
    "@typescript-eslint/no-non-null-assertion": 0,
    "sort-imports": ["error", { ignoreDeclarationSort: true }],
  },
};
