module.exports = {
  server: {
    baseDir: require('./webpack.config')('whatever').output.path,
  },
};
