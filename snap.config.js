module.exports = {
  bundler: 'webpack',
  input: './src/index.js',
  output: {
    path: './dist',
    filename: 'bundle.js',
  },
  server: {
    port: 8080
  }
};