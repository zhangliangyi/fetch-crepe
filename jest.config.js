/* eslint-disable */
const coverageThreshold = process.env.COVERAGE_THRESHOLD || 95;

module.exports = {
  rootDir: ".",
  testEnvironment: "jsdom",
  coverageDirectory: "./coverage",
  coverageThreshold: {
    global: {
      branches: 80,
      functions: coverageThreshold,
      lines: coverageThreshold,
      statements: coverageThreshold
    }
  },
  collectCoverageFrom: [
    "src/**/*.{js,ts,jsx,tsx}",
    "!**/node_modules/**",
    "!src/main.{js,ts,jsx,tsx}",
    "!src/**/index.{js,ts,jsx,tsx}",
    "!src/**/*.d.ts"
  ],
  transformIgnorePatterns: ["node_modules/(?!(@babel))"]
};
