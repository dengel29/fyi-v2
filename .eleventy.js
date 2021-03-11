module.exports = (config) => {
  config.setUseGitIgnore(false);
  config.addPassthroughCopy("./src/admin");
  // Transforms
  const htmlMinTransform = require("./src/transforms/html-min-transform.js");

  // Create a helpful production flag
  const isProduction = process.env.NODE_ENV === "production";

  // collections
  config.addCollection("blog", (collection) => {
    return [...collection.getFilteredByGlob("./src/posts/*.md")].reverse();
  });
  config.addCollection("notes", (collection) => {
    return [...collection.getFilteredByGlob("./src/notes/*.md")].reverse();
  });
  config.addCollection("projects", (collection) => {
    let projects = [...collection.getFilteredByGlob("./src/projects/*.md")];
    projects.sort((a, b) => a.data.order - b.data.order);
    return projects;
  });

  // Only minify HTML if we are in production because it slows builds _right_ down
  if (isProduction) {
    config.addTransform("htmlmin", htmlMinTransform);
  }

  return {
    markdownTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dir: {
      input: "src",
      output: "dist",
    },
  };
};
