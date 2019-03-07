const webpack = require('webpack');
module.exports = {
  plugins: [
    new webpack.IgnorePlugin(/ringo\/httpclient/),
    new webpack.IgnorePlugin(/^http$/),
    new webpack.IgnorePlugin(/^https$/)
  ]
}
