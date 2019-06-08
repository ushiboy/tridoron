const gulp = require('gulp'),
  $ = require('gulp-load-plugins')(),
  del = require('del'),
  connect = require('connect'),
  serveStatic = require('serve-static'),
  connectLiveReload = require('connect-livereload'),
  historyApiFallback = require('connect-history-api-fallback'),
  path = require('path'),
  exampleDir = path.join(__dirname, 'example'),
  distDir = path.join(exampleDir, 'dist'),
  webpack = require('webpack'),
  bundler = webpack({
    entry: {
      'hash': './example/hash.js',
      'history': './example/history.js',
      'minimal': './example/minimal.js'
    },
    devtool: 'inline-source-map',
    output: {
      path: distDir,
      filename: '[name]-bundle.js'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader'
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
    $.livereload.reload();
  });
});

gulp.task('serve', () => {
  const port = process.env.PORT || 3000;
  $.livereload.listen();
  connect()
    .use(connectLiveReload())
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

gulp.task('dev', gulp.series(gulp.parallel('js', 'serve')), () => {
  gulp.watch(['example/*.js', 'src/*.js'], gulp.task('js'));
});

gulp.task('default', gulp.series(gulp.parallel('clean'), gulp.task('dev')));
