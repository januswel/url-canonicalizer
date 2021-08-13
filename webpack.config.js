const path = require("path");

module.exports = {
  mode: "production",
  entry: {
    background: "./src/background.ts",
    move: "./src/move.ts",
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
};
