---
layout: page
title: Initiatives
permalink: /initiatives/
---

SORCE Collective organizes various initiatives to support artist-academic practice.

<div class="initiatives-list">
{% for initiative in site.initiatives %}
  <div class="initiative-card">
    <h3><a href="{{ initiative.url | relative_url }}">{{ initiative.title }}</a></h3>
    <p>{{ initiative.description }}</p>
    {% if initiative.status %}
    <p><strong>Status:</strong> {{ initiative.status }}</p>
    {% endif %}
  </div>
{% endfor %}
</div>

## Current Programs

### SORCE Show-and-Tell

Open-ended social sessions for practitioners to share work-in-progress, explore interdisciplinary connections, and build community. These informal gatherings create space for creative exchange without the pressure of formal presentation.

### Choose-Your-Own-Adventure Conference

An experimental event format that combines art-making with conversation, structured around spatial-temporal dimensions rather than traditional panels. Participants navigate through interconnected sessions based on their interests.

## Propose an Initiative

Have an idea for a SORCE initiative? We welcome proposals from collective members.

[Submit a proposal via GitHub &rarr;](https://github.com/{{ site.repository }}/issues/new?template=initiative-proposal.md)
