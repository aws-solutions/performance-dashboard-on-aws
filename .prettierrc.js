module.exports = {
  printWidth: 100,
  tabWidth: 2,
  singleQuote: false,
  semi: true,
  trailingComma: "all",
  arrowParens: "always",
  overrides: [
    {
      files: "*.{js,jsx,tsx,ts,scss,json,html}",
      options: {
        tabWidth: 4,
      },
    },
  ],
};
