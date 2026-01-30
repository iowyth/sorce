---
layout: page
title: People
permalink: /people/
---

SORCE Collective is made up of artist-academics working across various disciplines and institutions.

## Community Stewards

{% for person in site.people %}
{% unless person.category %}
<div class="person-card">
  <h3><a href="{{ person.url | relative_url }}">{{ person.name }}</a></h3>
  {% if person.pronouns %}<p><em>{{ person.pronouns }}</em></p>{% endif %}
  <p>{{ person.role }}</p>
  {% if person.institution %}<p>{{ person.institution }}</p>{% endif %}
  {% if person.website %}<p><a href="{{ person.website }}" target="_blank">Website</a></p>{% endif %}
</div>
{% endunless %}
{% endfor %}

## Friendship Circle

<div class="people-grid">
{% for person in site.people %}
{% if person.category == "friendship-circle" %}
<div class="person-card">
  <h3><a href="{{ person.url | relative_url }}">{{ person.name }}</a></h3>
  {% if person.pronouns %}<p><em>{{ person.pronouns }}</em></p>{% endif %}
  <p>{{ person.role }}</p>
  {% if person.institution %}<p>{{ person.institution }}</p>{% endif %}
  {% if person.website %}<p><a href="{{ person.website }}" target="_blank">Website</a></p>{% endif %}
</div>
{% endif %}
{% endfor %}
</div>

## SORCE Founders

<div class="people-grid">
{% for person in site.people %}
{% if person.category == "founder" %}
<div class="person-card">
  <h3><a href="{{ person.url | relative_url }}">{{ person.name }}</a></h3>
  <p>{{ person.role }}</p>
  {% if person.institution %}<p>{{ person.institution }}</p>{% endif %}
  {% if person.website %}<p><a href="{{ person.website }}" target="_blank">Website</a></p>{% endif %}
</div>
{% endif %}
{% endfor %}
</div>

---

## Join the Collective

Interested in becoming part of SORCE? We welcome artist-academics from all backgrounds and disciplines.

To be added to the People page, [submit a pull request](https://github.com/{{ site.repository }}/pulls) with your profile, or [start a discussion](https://github.com/{{ site.repository }}/discussions).
