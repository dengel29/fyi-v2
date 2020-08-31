const Cache = require('@11ty/eleventy-cache-assets')

/**
 * Grabs the remote data for studio images and returns an 
 * array of objects
 *
 * @returns {Array} Empty or array of objects
 */

module.exports = async () => {
  try {
    const data = await Cache(
      'https://raw.githubusercontent.com/dengel29/readings-workflow/master/output/articles.json',
      {
        duration: '1h',
        type: 'json'
      }
    )

    let articles = []
    data.records.forEach(record => {
      record.fields.Tags = [record.fields.Tags]
      record.fields.CreatedTime = record.createdTime.split('T')[0]
      articles.push(record.fields)


    });

    console.log(articles)
    return articles
  } catch (err) {
    console.log(err)
    return [];
  }
}