const path = require("path")
const UglifyJsPlugin = require("uglifyjs-webpack-plugin")
const glob = require("glob")

module.exports = {
  mode: 'production',
  entry: {
    "bundle.js": glob.sync("build/static/?(js|css)/*.?(js|css)").map(f => path.resolve(__dirname, f)),
  },
  output: {
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["css-loader?url=false"]
      },

      {
        test: /\.mjs$/, // or cjs
        include: /node_modules/,
        type: "javascript/auto"
      }
    ],
  },
  plugins: [new UglifyJsPlugin()],
}




/* const path = require("path")
const UglifyJsPlugin = require("uglifyjs-webpack-plugin")
const glob = require("glob")

module.exports = {
  mode: "production",
  entry: {
    "bundle.js": glob.sync("build/static/?(js|css)/main.*.?(js|css)").map(f => path.resolve(__dirname, f)),
  },
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "static/js/bundle.min.js",
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["css-loader?url=false"],
      },
      {
        test: /\.mjs$/, // or cjs
        include: /node_modules/,
        type: "javascript/auto"
      }
    ],
  },
  plugins: [new UglifyJsPlugin()],
} */

// const nrwlConfig = require("@nrwl/react/plugins/webpack.js");

// module.exports = (config, context) => {
//   // first call it so that @nrwl/react plugin adds its configs
//   nrwlConfig(config);

//   return {
//     ...config,
//     resolve: {
//       ...config.resolve,
//       alias: {
//         ...config.resolve.alias,
//         stream: require.resolve('stream-browserify'),
//         zlib: require.resolve('browserify-zlib'),
//       }
//     }
//   };
// };



// const path = require('path');
// const TerserPlugin = require('terser-webpack-plugin');

// module.exports = {
//   mode: 'production',
//   entry: path.join(__dirname, 'src/index.js'),
//   output: {
//     path: path.join(__dirname, '/dist'),
//     filename: `bundle.min.js`,
//   },
//   module: {
//     rules: [
//       {
//         test: /\.(js|jsx)$/,
//         exclude: /node_modules/,
//         use: {
//           loader: 'babel-loader',
//           options: { presets: ['@babel/env', '@babel/preset-react'] }
//         }
//       },
//       {
//         test: /\.(sass|css|scss)$/,
//         use: [
//           'style-loader',
//           'css-loader',
//           {
//             loader: "postcss-loader",
//             options: {
//               plugins: () => [
//                 require("autoprefixer")()
//               ],
//             },
//           },
//           'sass-loader',
//         ]
//       },
//       // Relevant bit of config for style loader and css loader:
//       // {
//       //   test: /\.(css)$/,
//       //   use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
//       // },
//       // {
//       //   test: /\.s[ac]ss$/i,
//       //   use: [
//       //     // Creates `style` nodes from JS strings
//       //     "style-loader",
//       //     // Translates CSS into CommonJS
//       //     "css-loader",
//       //     // Compiles Sass to CSS
//       //     "sass-loader",
//       //   ],

//       // },
//       {
//         test: /\.(jpe?g|png|gif|woff|woff2|eot|ttf|svg)(\?[a-z0-9=.]+)?$/,
//         loader: 'url-loader'
//       },
//     ]
//   },
//   optimization: {
//     minimize: true,
//     minimizer: [new TerserPlugin()],
//   },
// };

// const path = require('path');
// const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
// const BabelMinifyPlugin = require('babel-minify-webpack-plugin');

// module.exports = {
//   optimization: {
//     minimizer: [new OptimizeCSSAssetsPlugin({})],
//   },
//   entry: path.resolve(__dirname + '/public/bundle.js'),
//   output: {
//     path: path.resolve(__dirname + '/dist/'),
//     filename: 'adminBundle.js'
//   },
//   devtool: 'source-map',
//   module: {
//     rules: [{
//       test: /\.js$/,
//       exclude: /(node_modules)/,
//       use: {
//         loader: 'babel-loader',
//         options: {
//           presets: ['@babel/preset-env']
//         }
//       }
//     },
//     {
//       test: /\.(sa|sc|c)ss$/,
//       use: [{
//         loader: MiniCssExtractPlugin.loader
//       }, {
//         loader: "css-loader",
//       },
//       {
//         loader: "postcss-loader",
//         options: {
//           sourceMap: true
//         },
//       },
//       {
//         loader: "sass-loader",
//         options: {
//           sourceMap: true
//         },
//         options: {
//           implementation: require("sass")
//         }
//       }
//       ]
//     },
//     {
//       test: /\.(ttf|eot|svg|gif|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
//       use: [{
//         loader: 'file-loader',
//       }]
//     },
//     ]
//   },
//   plugins: [

//     new MiniCssExtractPlugin({
//       filename: "adminBundle.css"
//     }),

//   ]

// };