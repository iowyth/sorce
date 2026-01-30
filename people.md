---
layout: page
title: People
permalink: /people/
---

SORCE Collective is made up of artist-academics working across various disciplines and institutions.

<div class="people-grid">
{% for person in site.people %}
  <div class="person-card">
    {% if person.image %}
    <img src="{{ person.image | relative_url }}" alt="{{ person.name }}">
    {% endif %}
    <h3><a href="{{ person.url | relative_url }}">{{ person.name }}</a></h3>
    <p>{{ person.role }}</p>
    {% if person.institution %}
    <p><em>{{ person.institution }}</em></p>
    {% endif %}
  </div>
{% endfor %}
</div>

## Join the Collective

Interested in becoming part of SORCE? We welcome artist-academics from all backgrounds and disciplines.

To be added to the People page:
1. Fork this repository
2. Create a new file in the `_people` folder
3. Submit a pull request

[See the contribution guide &rarr;](/contribute/)
