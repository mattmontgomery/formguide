module.exports = {
  "**/*.{js,jsx,ts,tsx}": [
    () => "npm run lint:next",
    () => "npm run lint:build",
  ],
  "**/*.{scss,css}": [() => "npm run lint:style"],
};
