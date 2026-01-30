# SORCE Collective

**Supportive Organic Reflexive Community/Creative Empowerment**

A research-creation collective based at T'karonto Metropolitan University and York University, moving theory into praxis through creative, iterative, horizontal, community activity.

**Live site:** [iowyth.github.io/sorce](https://iowyth.github.io/sorce/)

---

## What We Do

SORCE hosts community events — gatherings, workshops, skill-sharing sessions — that support creative engagement within university contexts and beyond. We create spaces for emerging research methodologies, highlight member contributions, and foster collaboration between academic departments and broader communities.

We embrace diverse perspectives and work to build connections among marginalized communities and their allies through what scholars call *transverse politics*.

## How We Work

SORCE operates on a **horizontal model** where members maintain semi-autonomous roles while engaging in mutual support. Participation is flexible — involvement can range from observation to leadership, and we welcome masters students, doctoral candidates, artists, and community allies.

---

## This Site is Collaborative

This GitHub repository is an experiment in collective knowledge-making. The site is maintained collaboratively — anyone can propose changes, add content, or start discussions.

### New to GitHub?

GitHub is a platform for collaborative work. Here's how it works for SORCE:

1. **Reading** — You can browse the site and all its source files without an account
2. **Discussing** — Join conversations in [Discussions](../../discussions) (requires a free GitHub account)
3. **Suggesting edits** — Every page has an "Edit on GitHub" link; click it, make changes, and submit a "pull request" for review
4. **Contributing content** — Fork (copy) this repository, add your content, and submit it back

Don't worry about breaking anything — all changes are reviewed before they go live.

### Ways to Contribute

**Start a conversation**
Head to [Discussions](../../discussions) to introduce yourself, share ideas, or ask questions.

**Edit existing content**
See a typo? Want to clarify something? Click "Edit on GitHub" at the bottom of any page.

**Write a blog post**
1. Fork this repository (click "Fork" at the top right)
2. Create a new file in `_posts/` named `YYYY-MM-DD-your-title.md`
3. Write in Markdown (see existing posts for format)
4. Submit a pull request

**Add your profile**
1. Fork this repository
2. Copy `_people/example-member.md` to `_people/your-name.md`
3. Fill in your information
4. Submit a pull request

**Propose an initiative**
Open an [issue](../../issues/new?template=initiative-proposal.md) describing your idea.

**Suggest a resource**
Open an [issue](../../issues/new?template=resource-suggestion.md) with links and context.

---

## Running Locally

If you want to preview changes on your own computer:

```bash
# Clone the repository
git clone https://github.com/iowyth/sorce.git
cd sorce

# Install dependencies (requires Ruby)
bundle install

# Start local server
bundle exec jekyll serve

# View at http://localhost:4000
```

## Repository Structure

```
_posts/          # Blog posts (dated markdown files)
_people/         # Member profiles
_initiatives/    # Initiative descriptions
_layouts/        # Page templates
_includes/       # Reusable components
assets/          # Styles, scripts, images
```

---

## License

Content is shared under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) — you're free to share and adapt with attribution.
