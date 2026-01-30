---
layout: page
title: How to Contribute
permalink: /contribute/
---

SORCE Collective is collaboratively maintained. Here's how you can contribute.

## Quick Edits

Every page has an "Suggest an edit on GitHub" link at the bottom. Click it to propose changes directly.

## Writing a Blog Post

1. **Fork** this repository to your GitHub account
2. **Create** a new file in the `_posts` folder
3. **Name** it following the pattern: `YYYY-MM-DD-your-title.md`
4. **Add** front matter at the top:

```yaml
---
layout: post
title: "Your Post Title"
date: YYYY-MM-DD
author: Your Name
categories: [category1, category2]
tags: [tag1, tag2]
---
```

5. **Write** your content in Markdown
6. **Submit** a pull request

## Adding Yourself to People

Create a file in `_people/` with your username:

```yaml
---
name: Your Name
role: Your Role/Title
institution: Your Institution
image: /assets/images/people/your-photo.jpg
website: https://yoursite.com
twitter: yourusername
---

A brief bio about yourself and your practice.
```

## Proposing an Initiative

Open an issue with the "Initiative Proposal" template, or create a file in `_initiatives/`.

## Adding Resources

Open an issue with the "Resource Suggestion" template, or edit `resources.md` directly.

## Interactive Content

You can embed interactive elements in posts:

### Code Playgrounds

Use fenced code blocks with the language specified:

~~~markdown
```javascript
console.log("Hello, SORCE!");
```
~~~

### Embeds

Embed external content using iframes (for trusted sources):

```html
<div class="interactive-embed">
  <iframe src="..." title="..."></iframe>
</div>
```

## Code of Conduct

Contributors are expected to maintain a respectful, inclusive environment. We follow the [Contributor Covenant](https://www.contributor-covenant.org/).

## Questions?

Open a [discussion on GitHub](https://github.com/{{ site.repository }}/discussions) or reach out to the collective.
