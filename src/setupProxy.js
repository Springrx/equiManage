const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    console.log('setupProxy');
  app.use(
    '/equipment',
    createProxyMiddleware({
      target: 'http://10.177.44.94:8081',
      changeOrigin: true,
    })
  );
};
