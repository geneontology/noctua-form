const webpack = require('webpack');
module.exports = {
  resolve: {
    fallback: {
      "url": require.resolve("url/"),
      "querystring": require.resolve("querystring-es3")
    },
  },
  plugins: [
    new webpack.IgnorePlugin({ resourceRegExp: /ringo\/httpclient/ }),
    new webpack.IgnorePlugin({ resourceRegExp: /^http$/ }),
    new webpack.IgnorePlugin({ resourceRegExp: /^https$/ })
  ]
}
