const path = require('path');
const isDev = (process.env.NODE_ENV !== 'production');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const globImporter = require('node-sass-glob-importer');
const FixStyleOnlyEntriesPlugin = require('webpack-fix-style-only-entries');
const autoprefixer = require('autoprefixer');

module.exports = {
  entry: {
    // Main
    mollo_main: ['./styles/mollo-main.scss'],
    mollo: ['./js/mollo.js'],

    // Sites
    simple_site: ['./styles/sites/simple-site.scss'],

    // Nodes

  },
  output: {
    devtoolLineToLine: true,
    path: path.resolve(__dirname, 'dist'),
    chunkFilename: 'js/async/[name].chunk.js',
    pathinfo: true,
    filename: 'js/[name].js',
    publicPath: '../',
  },
  module: {
    rules: [{
      test: /\.(config.js)$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: '[path][name].[ext]',
            outputPath: './'
          }
        }
      ]
    },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        exclude: /sprite\.svg$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: 'media/[name].[ext]?[hash]',
          },
        },
        ],
      },
      {
        test: /sprite\.svg$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: 'media/[name].[ext]',
          },
        },
        ],
      },
      {
        test: /modernizrrc\.js$/,
        loader: 'expose-loader?Modernizr!webpack-modernizr-loader',
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(css|sass|scss)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              name: '[name].[ext]?[hash]',
            }
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: isDev,
              importLoaders: 2,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [autoprefixer()],
              sourceMap: isDev,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: isDev,
              sassOptions: {
                importer: globImporter()
              },
            },
          },
        ],
      },
    ],
  },
  resolve: {
    modules: [
      path.join(__dirname, 'node_modules'),
    ],
    extensions: ['.js', '.json'],
  },
  plugins: [
    new FriendlyErrorsWebpackPlugin(),
    new FixStyleOnlyEntriesPlugin(),
    new CleanWebpackPlugin(['dist'], {
      root: path.resolve(__dirname),
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
    }),
  ],
  watchOptions: {
    aggregateTimeout: 300,
  }
};
