module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: ["standard-with-typescript", "prettier"],
    plugins: ["prettier"],
    overrides: [],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: ["./tsconfig.json"],
    },
    rules: {
        "prettier/prettier": ["error"],
        // "@typescript-eslint/explicit-function-return-type": ["off"],
        // "@typescript-eslint/strict-boolean-expressions": "off",
        // "@typescript-eslint/consistent-type-assertions": "off",
        // "@typescript-eslint/no-floating-promises": "off",
        // "@typescript-eslint/restrict-template-expressions": "off",
        // "@typescript-eslint/no-misused-promises": "off",
        // "@typescript-eslint/prefer-optional-chain": "off",
        // "@typescript-eslint/prefer-nullish-coalescing": "off",
        // "@typescript-eslint/restrict-plus-operands": "off",
        // "react-hooks/exhaustive-deps": "off",
    },
};
