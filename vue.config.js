module.exports = {
  chainWebpack(config) {
    config.plugin('html').tap((args) => {
      args[0].title = 'Air Quality - World Map'; // eslint-disable-line
      return args;
    });
  },
  css: {
    loaderOptions: {
      scss: {
        prependData: '@import "~@/scss/variables.scss";',
      },
    },
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        ws: true,
        changeOrigin: true,
      },
    },
  },
};
