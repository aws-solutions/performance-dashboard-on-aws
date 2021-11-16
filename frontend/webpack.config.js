const path = require("path");

module.exports = {
  mode: "development",
  entry: path.resolve(__dirname, "./src/index.js"),
  devtool: "eval-source-map",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      {
        test: /\.(s(a|c)ss)$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
    ],
  },
  resolve: {
    extensions: ["*", ".js", ".jsx"],
  },
  output: {
    path: path.resolve(__dirname, "./public"),
    filename: "bundle.js",
  },
  devServer: {
    contentBase: path.resolve(__dirname, "./public"),
    hot: true,
  },
};
