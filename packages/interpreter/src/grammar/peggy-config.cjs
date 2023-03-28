const { resolve } = require("node:path");

module.exports = {
  format: "es",
  input: resolve(__dirname, "main.pegjs"),
  output: resolve(__dirname, "index.js"),
};
