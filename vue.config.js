const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      fallback: {
        stream: require.resolve('stream-browserify'),
        crypto: require.resolve('crypto-browserify'),
        path: require.resolve('path-browserify'),
        os: require.resolve('os-browserify/browser'),
        process: require.resolve('process'),
      },
    },
    plugins: [
      // Ajoutez un plugin pour définir `process.env` dans l'environnement du navigateur
      new (require('webpack')).ProvidePlugin({
        process: 'process/browser',
      }),
    ],
  },
});
