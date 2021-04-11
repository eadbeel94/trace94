const path= require('path');
//const fse= require('fs-extra');
const fs= require('fs');
const prod= process.env.NODE_ENV === 'production';

const TerserPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin= require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

const orgPath= './frontend/pages/';
const desPath= './www';
const outFiles= [{},[]];
const inpFiles= [
  ['table','01-table','/index.html'],
  ['graph','02-graph','/pages/chart/index.html'],
  ['about','03-about','/pages/about/index.html'],
]
outFiles[0]['resume']= './frontend/js/resume.js';

inpFiles.forEach( r =>{  
  //fse.readdirSync( path.join(__dirname, orgPath) ).forEach( name =>{
  outFiles[0][`${r[0]}`]= orgPath + r[1] + '/app.js';
  outFiles[1].push( new HtmlWebpackPlugin({
    template: path.join( __dirname, orgPath, r[1], 'index.html' ),
    filename: path.join( __dirname, desPath, r[2] ),
    chunks: ['resume',`${r[0]}`],
    templateParameters: {
      htmlWebpackPlugin: {
        tags: {
          title: "Trace 94",
          footer: fs.readFileSync( path.join( __dirname, './frontend/template/footer.html' ) ),
          //IP: prod ? '' : 'http://localhost:3300'
        },
      }
    },
    minify: prod ? {
      collapseWhitespace: true, removeComments: true, removeRedundantAttributes: true,
      removeScriptTypeAttributes: true, removeStyleLinkTypeAttributes: true, useShortDoctype: true
    } : {},
  }) );
});

module.exports= {
  entry: outFiles[0],
  mode: prod ? 'production' : 'development',
  output: {
    path: path.join(__dirname, 'www'),
    filename: 'js/[name].bundle.js',
    publicPath: '/'
  },
  devServer: {
    contentBase: path.join(__dirname, 'www'), //hot: false, inline: false,
  },
  module : {
    rules: [
      {
        test: /\.(sass|css|scss)$/,
        use: [prod ? MiniCssExtractPlugin.loader : 'style-loader','css-loader']
      },{
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [{loader: 'file-loader', options:{ outputPath: 'fonts/', name: '[name].[ext]' }}],
      },{
        test: /\.(png|svg|jpg|jpeg|gif|ico)$/i,
        use: [{loader: 'file-loader', options:{ outputPath: 'img/', name: '[name].[ext]' }}],
      },
    ]
  },
  plugins: prod ? [ new MiniCssExtractPlugin({ filename: 'css/[name].bundle.css' }) ].concat(outFiles[1]) : outFiles[1],
  optimization: prod ? {
    minimize: true,
    minimizer: [
      new TerserPlugin(),
      new CssMinimizerPlugin({
        minimizerOptions: {
          preset: [
            'default',
            {
              discardComments: { removeAll: true },
            },
          ],
        },
      }),
    ]
  } : {},
  devtool: 'source-map'
};