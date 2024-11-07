// {
//   "extends": ["next/core-web-vitals", "next/typescript"]
// }

module.exports = {
  // existing config...
  overrides: [
    {
      files: ["**/*.ts", "**/*.tsx"], // Or any specific files you'd like to target
      env: {
        production: true,
      },
      rules: {
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/no-explicit-any": "off",
        // Add other rules to disable only in production
      },
    },
  ],
};