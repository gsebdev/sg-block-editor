const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const nodeExternals = require("webpack-node-externals");

module.exports = (env, args) => {
  const isProd = args.mode === "production";

  if (isProd) {
    return {
      mode: "production",
      entry: "./src/index.ts", // Main entry point
      output: {
        path: path.resolve(__dirname, "dist"),
        filename: "index.js",
        clean: true,
        library: {
          type: "module",
        },
        globalObject: "this",
      },
      resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx", ".scss", ".css", ".json"],
      },
      externals: [nodeExternals()],
      module: {
        rules: [
          {
            test: /\.(ts|tsx|js|jsx)$/,
            use: {
              loader: "babel-loader",
              options: {
                presets: [
                  ["@babel/preset-env"],
                  ["@babel/preset-react", { runtime: "automatic" }],
                  "@babel/preset-typescript",
                ],
                plugins: ["@babel/plugin-transform-runtime"],
              },
            },
            exclude: /node_modules/,
          },
          {
            test: /\.css$/,
            use: [
              "style-loader",
              "css-loader"
            ],
          },
          {
            test: /\.s[ac]ss$/,
            use: [
              "style-loader",
              "css-loader",
              "sass-loader",
            ],
          },
        ],
      },
      experiments: {
        outputModule: true
      },
     
    };
  }

  return {
    mode: "production",
    entry: "./demo/index.tsx",
    output: {
      filename: "[name].[contenthash].js",
      path: path.resolve(__dirname, "docs"),
      clean: true,
    },
    resolve: {
      extensions: [".js", ".jsx", ".ts", ".tsx", ".scss", ".css", ".json"],
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx|js|jsx)$/,
          use: {
            loader: "babel-loader",
            options: {
              presets: [
                ["@babel/preset-env"],
                ["@babel/preset-react", { runtime: "automatic" }],
                "@babel/preset-typescript",
              ],
              plugins: ["@babel/plugin-transform-runtime"],
            },
          },
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.s[ac]ss$/i,
          use: ["style-loader", "css-loader", "sass-loader"],
        },
      ],
    },
    devServer: {
      static: "./demo",
      hot: true,
      open: true,
    },
    optimization: {
      minimize: true,
      splitChunks: {
        chunks: "all",
      },
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./demo/index.html",
        inject: true,
        minify: isProd,
      }),
    ],
  };
};
