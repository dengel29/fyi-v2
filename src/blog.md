---
title: "Dan's Blog"
layout: ''
pagination:
  data: collections.blog
  size: 5
  alias: posts
permalink: 'blog{% if pagination.pageNumber > 0 %}/page/{{ pagination.pageNumber }}{% endif %}/index.html'
paginationPrevText: 'Newer posts'
paginationNextText: 'Older posts'
paginationAnchor: '#post-list'
---