const gulp = require('gulp'),
  $ = require('gulp-load-plugins')(),
  del = require('del'),
  connect = require('connect'),
  serveStatic = require('serve-static'),
  historyApiFallback = require('connect-history-api-fallback'),
  path = require('path'),
  exampleDir = path.join(__dirname, 'example'),
  distDir = path.join(exampleDir, 'dist'),
  webpack = require('webpack'),
  bundler = webpack({
    entry: {
      'hash': './example/hash.js',
      'history': './example/history.js'
    },
    devtool: 'inline-source-map',
    output: {
      path: distDir,
      filename: '[name]-bundle.js'
    },
    module: {
      loaders: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel'
        }
      ]
    }
  });

gulp.task('clean', del.bind(null, [distDir]));

gulp.task('js', cb => {
  bundler.run((err, stats) => {
    if (err) {
      throw new $.util.PluginError('webpack:build', err);
    }
    $.util.log('[webpack:build]', stats.toString({
      colors: true,
      chunkModules: false
    }));
    cb();
  });
});

gulp.task('serve', () => {
  const port = process.env.PORT || 3000;
  connect()
    .use(historyApiFallback({
      rewrites: [
        {
          from: /\/dist\/(.*)-bundle.js$/,
          to: context => context.match[0]
        }
      ],
      verbose: false
    }))
    .use(serveStatic(exampleDir))
    .listen(port);
});

gulp.task('dev', ['js', 'serve'], () => {
  gulp.watch(['example/*.js', 'src/*.js'], ['js']);
});

gulp.task('default', ['clean'], () => {
  gulp.start('dev');
});
