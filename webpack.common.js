const autoprefixer = require("autoprefixer");
const path = require("path");

module.exports = {
  entry: ["./app.scss", "./app.js"],
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "bundle.css"
            }
          },
          { loader: "extract-loader" },
          { loader: "css-loader" },
          {
            loader: "postcss-loader",
            options: {
              plugins: () => [autoprefixer()]
            }
          },
          {
            loader: "sass-loader",
            options: {
              includePaths: ["./node_modules"]
            }
          }
        ]
      },
      {
        test: /\.js$/,
        loader: "babel-loader",
        query: {
          presets: ["es2015"]
        }
      }
    ]
  }
};
