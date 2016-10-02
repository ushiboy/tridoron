const gulp = require('gulp'),
  connect = require('connect'),
  serveStatic = require('serve-static'),
  historyApiFallback = require('connect-history-api-fallback'),
  path = require('path'),
  distDir = path.join(__dirname, 'example');


gulp.task('serve', () => {
  const port = process.env.PORT || 3000;
  connect()
    .use(historyApiFallback({
      rewrites: [
        {
          from: /(.*)-bundle.js$/,
          to: context => `/${path.basename(context.match[0])}`
        }
      ],
      verbose: false
    }))
    .use(serveStatic(distDir))
    .listen(port);
});

gulp.task('default', ['serve']);
