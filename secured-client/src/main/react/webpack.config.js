const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { BaseHrefWebpackPlugin } = require('base-href-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');

const { join } = require('path');
const pathTo = rel => join(process.cwd(), rel);

const isProd = env => env !== 'development';
const publicPath = env => env === 'ghpages' ? '/react/' : '/';
const devtool = env => isProd(env) ? 'cheap-module-source-map' : 'inline-source-map';

const { version } = require('./package.json');
const suffix = '?v=' + version;

module.exports = env => ({

  context: pathTo('.'),

  output: {
    jsonpFunction: 'w',
    path: pathTo('../../../build/resources/main/static'),
    publicPath: publicPath(env),
    filename: '[name].js' + suffix,
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/i,
        use: [
          'babel-loader',
        ],
        include: pathTo('./src'),
      },

      {
        test: /\.css$/i,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              minimize: isProd(env),
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [
                require('postcss-svgo')(),
                require('autoprefixer')([
                  'last 4 versions',
                ]),
                require('postcss-sorting'),
              ].filter(p => !!p),
            },
          },
        ],
      },

      {
        test: /\.(woff2?|eot|ttf|svg|ico|jpe?g|png|gif|raw)$/i,
        use: {
          loader: 'url-loader',
          options: {
            limit: 1000,
          },
        },
      },
    ],
  },

  entry: {
    polyfills: './src/polyfills.js',
    vendors: './src/vendors.js',
    app: './src/main.jsx',
  },

  plugins: [

    new webpack.optimize.CommonsChunkPlugin({
      names: ['app', 'vendors', 'polyfills', 'manifest'],
    }),

    new HtmlWebpackPlugin({
      template: './src/index.html',
      chunksSortMode: 'dependency',
      minify: isProd(env) ? {
        collapseWhitespace: true,
        removeComments: true,
        minifyCSS: true,
        minifyJS: true,
      } : false,
      cache: true,
      showErrors: true,
      excludeChunks: [],
      xhtml: true,
    }),

    new BaseHrefWebpackPlugin({
      baseHref: publicPath(env),
    }),

    new ScriptExtHtmlWebpackPlugin({
      defaultAttribute: 'defer',
    }),

    new webpack.NoEmitOnErrorsPlugin(),

    isProd(env) ? new webpack.optimize.AggressiveMergingPlugin() : undefined,

    !isProd(env) ? new webpack.NamedModulesPlugin() : undefined,
/*
    isProd(env) ? new CompressionWebpackPlugin({
      asset: '[path].gz?[query]',
    }) : undefined,
*/
    new webpack.LoaderOptionsPlugin({
      minimize: isProd(env),
      debug: !isProd(env),
    }),

    isProd(env) ? new webpack.optimize.UglifyJsPlugin({
      beautify: false,
      mangle: {
        screw_ie8: true,
        keep_fnames: true,
      },
      compress: {
        screw_ie8: true,
        warnings: false,
      },
      comments: false,
      sourceMap: devtool(env) === 'source-map',
    }) : undefined,

    isProd(env) ? new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }) : undefined

  ].filter(p => !!p),

  resolve: {
    extensions: [
      '.js',
      '.jsx',
      '.css',
    ],
  },

  devtool: devtool(env),

  devServer: {
    port: 8000,
    noInfo: false,
    stats: 'minimal',
    host: 'localhost',
    historyApiFallback: true,
    contentBase: pathTo('./dist'),
    publicPath: publicPath(env),
  },

});
