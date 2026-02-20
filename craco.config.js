const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Replace moment with dayjs
      webpackConfig.plugins.push(
        new webpack.NormalModuleReplacementPlugin(/^moment$/, require.resolve('dayjs')),
        new webpack.NormalModuleReplacementPlugin(/moment\/min\/moment-with-locales/, require.resolve('dayjs')),
        new AntdDayjsWebpackPlugin(),
        new webpack.IgnorePlugin({ resourceRegExp: /^\.\/locale$/, contextRegExp: /moment$/ })
      );
      return webpackConfig;
    },
  },
  // babel plugins disabled to avoid style import errors
};