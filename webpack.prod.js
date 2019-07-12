const merge = require("webpack-merge");
const common = require("./webpack.common.js");
const { DefinePlugin } = require("webpack");

module.exports = merge(common, {
  plugins: [
    new DefinePlugin({
      OAUTH_CLIENT_ID: JSON.stringify(config.OAUTH_CLIENT_ID),
      API_KEY: JSON.stringify(config.PROD_API_KEY)
    })
  ]
});
