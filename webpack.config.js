const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    library: 'sg-block-editor',
    libraryTarget: 'umd',
    globalObject: 'this', 
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: {
          loader: 'ts-loader',
          options: {
            configFile: 'tsconfig.build.json'
          }
        },
        exclude: /node_modules/,

      },
    ],
  },
  externals: {
    react: 'react',
    'react-dom': 'react-dom',
  },
};

module.exports = {
  mode: 'development',
  entry: './demo/src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'demo'),
    filename: 'demo.js',
  },
  devServer: {
    static: './demo',
    hot: true,
    open: true
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.scss', '.css', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: {
          loader: 'ts-loader',
          options: {
            configFile: 'tsconfig.build.json'
          }
        },
        exclude: /node_modules/,

      },
      {
        test: /\.css$/,
        use: [
          'style-loader', 
          'css-loader',
        ],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader', 
          'css-loader',   
          'sass-loader',
        ],
      },
    ],
  },
}