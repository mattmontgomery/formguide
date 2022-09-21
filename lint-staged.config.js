module.exports = {
  "**/*.{js,jsx,ts,tsx}": [
    () => "npm run lint:next",
    () => "npm run lint:build",
  ],
  "**/*.{js,jsx,ts,tsx}": [() => "npm run lint:style"],
};
