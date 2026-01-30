---
layout: default
title: Home
---

<div class="home-intro">
  <p><strong>SORCE Collective</strong> generates opportunities for artist-academics to connect, reflect, and share their practices in the hopes of fostering creative collaborations.</p>
</div>

## Recent Posts

<ul class="posts-list">
{% for post in site.posts limit:5 %}
  <li>
    <a href="{{ post.url | relative_url }}" class="post-link">{{ post.title }}</a>
    <p class="post-meta">{{ post.date | date: "%B %d, %Y" }}</p>
    {% if post.excerpt %}
    <p class="post-excerpt">{{ post.excerpt | strip_html | truncatewords: 30 }}</p>
    {% endif %}
  </li>
{% endfor %}
</ul>

{% if site.posts.size > 5 %}
<p><a href="{{ '/blog' | relative_url }}">View all posts &rarr;</a></p>
{% endif %}
