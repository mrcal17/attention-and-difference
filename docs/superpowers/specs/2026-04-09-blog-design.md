# Attention and Difference — Blog Design Spec

## Overview

A minimal, modern AI ethics blog co-authored by two writers. Built with Astro, deployed on GitHub Pages. The site title alternates between "Attention and Difference" and "Difference and Attention" on each page load — a nod to Deleuze's *Difference and Repetition* and the transformer paper "Attention Is All You Need."

## Stack

- **Framework:** Astro (static site generator)
- **Hosting:** GitHub Pages
- **Deployment:** GitHub Action triggered on push to `main`
- **Content format:** Markdown files with YAML frontmatter
- **Runtime JS:** Near-zero — only the title alternation script and dark/light mode toggle

## Project Structure

```
attention-and-difference/
├── src/
│   ├── layouts/
│   │   ├── Base.astro          # shell: head, nav, footer, theme toggle
│   │   └── Post.astro          # single post layout (extends Base)
│   ├── pages/
│   │   ├── index.astro         # home — recent posts list
│   │   ├── about.astro         # about page
│   │   └── tags/
│   │       └── [tag].astro     # dynamic tag pages
│   ├── content/
│   │   └── posts/              # markdown files live here
│   └── styles/
│       └── global.css          # CSS variables for light/dark, typography
├── public/                     # static assets (images, favicon)
├── astro.config.mjs
└── package.json
```

## Pages

### Home (`index.astro`)
- Site title (alternating) at top
- List of all posts, newest first
- Each entry shows: title, author, date, tags, short description
- No hero images, no sidebar — just the list

### Post (`Post.astro`)
- Title, author name, date, tags at top
- Rendered markdown body with full styling for all markdown syntax: headings, code blocks (inline and fenced), block quotes, footnotes, links, bold, italic, lists, horizontal rules, tables, images
- Tags link to their respective tag pages

### About (`about.astro`)
- What the blog is about and why it exists
- Brief bios for both authors
- Static content, not markdown-driven

### Tag Pages (`tags/[tag].astro`)
- Filtered list of posts for a given tag
- Same format as the home page post list

## Post Frontmatter Schema

```yaml
---
title: "Post Title"
author: "Author Name"       # individual or both names for co-authored
date: 2026-04-09
tags: ["ai-ethics", "fairness"]
description: "A short description for the post list and meta tags."
---
```

## Visual Design

### Typography
- **Headings:** Serif font, semi-bold weight (e.g., Lora, Playfair Display, or similar)
- **Body:** Clean, legible sans-serif (e.g., Inter, Source Sans, or similar)
- **Line height:** Generous (~1.7 for body text)
- **Content max-width:** ~680px to keep lines readable

### Light Mode
- White or off-white background
- Dark text
- Subtle gray accents for metadata (dates, tags, author names)

### Dark Mode
- Near-black background (#0a0a0a or similar)
- Light text
- Same accent structure, inverted

### Theme Toggle
- Toggle button in the nav/header area
- Preference saved to `localStorage`, persists across visits
- Respects `prefers-color-scheme` media query on first visit

### Navigation
- Site title on the left (the alternating title — clickable, links home)
- Right side: Home, About, theme toggle
- No hamburger menus, no dropdowns
- Sticky or static — nothing fancy

### Tags
- Small pill-shaped badges displayed on posts and post list entries
- Clickable, muted color styling
- Consistent between light and dark mode

### Overall Aesthetic
- Lots of whitespace
- Writing dominates — nothing competes for attention
- No animations, no decorative elements
- The design says "we take ideas seriously"

## The Alternating Title

A small inline `<script>` in `Base.astro`:
- On each page load, randomly selects either "Attention and Difference" or "Difference and Attention"
- Applied to the site header/logo text element
- Pure JS, no framework dependency

## Markdown Styling

Full, consistent styling for all standard markdown elements:
- `h1` through `h6` with clear hierarchy (serif, semi-bold)
- Paragraphs with comfortable spacing
- Inline `code` and fenced code blocks with syntax highlighting
- Blockquotes with left border accent
- Ordered and unordered lists
- Links with subtle underline/color treatment
- Bold and italic
- Horizontal rules
- Tables (if used)
- Footnotes
- Images with optional captions

## What's NOT in Scope

- Newsletter/email collection
- Comments system
- Search
- Pagination (not needed until post count warrants it)
- RSS feed (can add later trivially)
- Analytics
- Custom domain setup (will be done separately after launch)

## Deployment

- GitHub repo hosts the source
- GitHub Action builds Astro on push to `main` and deploys to GitHub Pages
- Initial URL: `<username>.github.io/attention-and-difference/`
- Custom domain to be configured later
