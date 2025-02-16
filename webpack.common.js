const path = require("path");
const webpack = require('webpack');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { InjectManifest } = require('workbox-webpack-plugin');

module.exports = {
  target: "web",
  output: {
    path: path.resolve(__dirname, "dist"),
    publicPath: "",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
          },
        ],
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
      {
        test: /\.worker\.js$/,
        use: { loader: 'worker-loader' }
      }
    ],
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/index.html",
      filename: "./index.html",
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css",
    }),
    new webpack.DefinePlugin({
      'process.env.PORT': JSON.stringify(process.env.PORT || '8686'),
      'process.env.PROD_SERVER': JSON.stringify(process.env.PROD_SERVER || '://localhost'),
      'process.env.PROD_PROTOCOL': JSON.stringify(process.env.PROD_PROTOCOL || 'http')
    }),
    new InjectManifest({
      swSrc: './src/js/sw.js',
      swDest: 'service-worker.js',
      // injectionPoint: undefined
    }),
  ],
};
