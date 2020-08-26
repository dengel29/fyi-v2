const { dest, src } = require('gulp');

// Grabs all images, runs them through imagemin
// and plops them in the dist folder

const scripts = () => {
  // We have specific configs for jpeg and png files to try
  // to really pull down asset sizes

  return src('./src/scripts/**/*')
    .pipe(dest('./dist/scripts'));
};

module.exports = scripts;