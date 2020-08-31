---
title: "Dan's Blog"
layout: 'layouts/home.html'
list: true
postHeader: "Some more thoughts, coding an otherwise"
pagination:
  data: collections.blog
  size: 5
  alias: posts
permalink: 'blog{% if pagination.pageNumber > 0 %}/page/{{ pagination.pageNumber }}{% endif %}/index.html'
paginationPrevText: 'Newer posts'
paginationNextText: 'Older posts'
paginationAnchor: '#post-list'
borderHighlight: "primary"
accentHighlight: "secondary"
imgSrc: ../../images/bb-reflection.jpg
---