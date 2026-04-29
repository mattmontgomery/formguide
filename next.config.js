const { transpile } = require("typescript");
const { buildRedirects } = require("./redirects");

module.exports = {
  images: {
    domains: ["media.api-sports.io"],
  },
  transpilePackages: ["@mui/x-data-grid"],
  async redirects() {
    return buildRedirects();
  },
};
