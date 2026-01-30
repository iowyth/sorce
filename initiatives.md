---
layout: page
title: Initiatives
permalink: /initiatives/
---

SORCE Collective organizes various initiatives to support artist-academic practice.

## Ongoing

{% for initiative in site.initiatives %}
{% if initiative.status == "Ongoing" %}
<div class="initiative-card">
  <h3><a href="{{ initiative.url | relative_url }}">{{ initiative.title }}</a></h3>
  <p>{{ initiative.description }}</p>
</div>
{% endif %}
{% endfor %}

## Past Initiatives

<div class="initiatives-list">
{% for initiative in site.initiatives %}
{% if initiative.status == "Past" %}
<div class="initiative-card">
  <h3><a href="{{ initiative.url | relative_url }}">{{ initiative.title }}</a></h3>
  <p>{{ initiative.description }}</p>
</div>
{% endif %}
{% endfor %}
</div>

---

## Propose an Initiative

Have an idea for a SORCE initiative? We welcome proposals from collective members and allies.

[Submit a proposal via GitHub](https://github.com/{{ site.repository }}/issues/new?template=initiative-proposal.md)
