// {
//   "extends": ["next/core-web-vitals", "next/typescript"]
// }

module.exports = {
  extends: [
    'next/core-web-vitals',  // Ensures core Next.js web vitals rules
    'next/typescript',       // TypeScript rules for Next.js
  ],
  overrides: [
    {
      files: ["**/*.ts", "**/*.tsx"], // Or any specific files you'd like to target
      env: {
        browser: true,  // for client-side code
        node: true,     // for server-side code (like Next.js)
      },
      rules: {
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/no-explicit-any": "off",
        // Add other rules to disable only in production
      },
    },
  ],
};