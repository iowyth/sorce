---
layout: page
title: Blog
permalink: /blog/
---

Updates, reflections, and announcements from the SORCE Collective.

<ul class="posts-list">
{% for post in site.posts %}
  <li>
    <a href="{{ post.url | relative_url }}" class="post-link">{{ post.title }}</a>
    <p class="post-meta">
      {{ post.date | date: "%B %d, %Y" }}
      {% if post.author %} &bull; {{ post.author }}{% endif %}
    </p>
    {% if post.excerpt %}
    <p class="post-excerpt">{{ post.excerpt | strip_html | truncatewords: 40 }}</p>
    {% endif %}
  </li>
{% endfor %}
</ul>

{% if site.posts.size == 0 %}
<p>No posts yet. Check back soon!</p>
{% endif %}

---

## Write for SORCE

We welcome contributions from collective members and the broader artist-academic community.

To submit a post:
1. Fork this repository
2. Create a new file in the `_posts` folder following the naming convention: `YYYY-MM-DD-title.md`
3. Submit a pull request

[View contribution guidelines &rarr;](/contribute/)
