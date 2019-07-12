const config = require("./config.json");
const merge = require("webpack-merge");
const common = require("./webpack.common.js");
const { DefinePlugin } = require("webpack");

module.exports = merge(common, {
  devtool: "inline-source-map",
  devServer: {
    contentBase: "./public",
    port: 8080
  },
  plugins: [
    new DefinePlugin({
      OAUTH_CLIENT_ID: JSON.stringify(config.OAUTH_CLIENT_ID),
      API_KEY: JSON.stringify(config.DEV_API_KEY)
    })
  ]
});