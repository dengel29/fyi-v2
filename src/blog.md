---
title: "Dan's Blog"
layout: 'layouts/home.html'
list: true
postHeader: "Writing about coding"
pagination:
  data: collections.blog
  size: 5
  alias: posts
permalink: 'blog{% if pagination.pageNumber > 0 %}/page/{{ pagination.pageNumber }}{% endif %}/index.html'
paginationPrevText: 'Newer posts'
paginationNextText: 'Older posts'
paginationAnchor: '#post-list'
imgSrc: ../../images/bb-reflection.jpg
imgAlt: 'A profile of my dog, Baby, looking out of my old apartment window in Chengdu, Sichuan'
highlight: "primary"
accentHighlight: "secondary"
---