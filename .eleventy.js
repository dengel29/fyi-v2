module.exports = config => {
  config.setUseGitIgnore(false);

  // collections
  config.addCollection('blog', collection => {
    return [...collection.getFilteredByGlob('./src/posts/*.md')].reverse();
  })
  config.addCollection('notes', collection => {
    return [...collection.getFilteredByGlob('./src/notes/*.md')].reverse();
  })

  return {
    markdownTemplateEngine: 'njk',
    dataTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    dir: {
      input: 'src',
      output: 'dist'
    }
  };
};

