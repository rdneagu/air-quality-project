module.exports = {
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
