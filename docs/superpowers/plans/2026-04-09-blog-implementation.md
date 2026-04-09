# Attention and Difference — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a minimal, modern AI ethics blog with Astro on GitHub Pages featuring alternating title, light/dark mode, Tufte-style sidenotes, drop caps, and elegant typography.

**Architecture:** Static site built with Astro. Markdown posts with YAML frontmatter are transformed at build time via a custom rehype plugin that converts footnotes into Tufte-style sidenotes. CSS custom properties handle light/dark mode. GitHub Actions deploys to GitHub Pages on push to main.

**Tech Stack:** Astro 5.x, TypeScript, CSS custom properties, rehype (unified ecosystem), GitHub Actions

---

### Task 1: Project Scaffolding

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `.gitignore`

- [ ] **Step 1: Initialize Astro project**

Run:
```bash
cd C:/Users/landa/Desktop/attention-and-difference
npm create astro@latest . -- --template minimal --no-install --typescript strict
```

If prompted to overwrite, allow it (only the existing docs/ and .git/ matter, and the scaffold won't touch those).

- [ ] **Step 2: Install dependencies**

Run:
```bash
npm install
```

- [ ] **Step 3: Configure Astro for GitHub Pages**

Replace the contents of `astro.config.mjs`:

```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://mrcal17.github.io',
  base: '/attention-and-difference',
});
```

- [ ] **Step 4: Verify it builds**

Run:
```bash
npx astro build
```
Expected: Build succeeds with no errors.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: scaffold Astro project with GitHub Pages config"
```

---

### Task 2: Global Styles and CSS Custom Properties

**Files:**
- Create: `src/styles/global.css`

- [ ] **Step 1: Create global stylesheet with light/dark tokens and typography**

Create `src/styles/global.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400;1,600&family=Inter:wght@400;500;600&display=swap');

:root {
  /* Light mode (default) */
  --color-bg: #fafafa;
  --color-text: #1a1a1a;
  --color-text-secondary: #6b6b6b;
  --color-accent: #4a4a4a;
  --color-border: #e0e0e0;
  --color-tag-bg: #f0f0f0;
  --color-tag-text: #555;
  --color-code-bg: #f5f5f5;
  --color-blockquote-border: #d0d0d0;
  --color-sidenote: #6b6b6b;
  --color-link: #1a1a1a;
  --color-link-underline: #aaa;

  /* Typography */
  --font-serif: 'Lora', Georgia, serif;
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
  --line-height: 1.7;
  --content-width: 680px;
  --sidenote-width: 250px;
}

[data-theme="dark"] {
  --color-bg: #0a0a0a;
  --color-text: #e0e0e0;
  --color-text-secondary: #888;
  --color-accent: #aaa;
  --color-border: #2a2a2a;
  --color-tag-bg: #1e1e1e;
  --color-tag-text: #aaa;
  --color-code-bg: #141414;
  --color-blockquote-border: #333;
  --color-sidenote: #888;
  --color-link: #e0e0e0;
  --color-link-underline: #555;
}

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 18px;
}

body {
  font-family: var(--font-sans);
  line-height: var(--line-height);
  color: var(--color-text);
  background-color: var(--color-bg);
  transition: background-color 0.2s ease, color 0.2s ease;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

a {
  color: var(--color-link);
  text-decoration-color: var(--color-link-underline);
  text-underline-offset: 3px;
  transition: text-decoration-color 0.15s ease;
}

a:hover {
  text-decoration-color: var(--color-link);
}
```

- [ ] **Step 2: Commit**

```bash
git add src/styles/global.css
git commit -m "feat: add global CSS with light/dark tokens and typography"
```

---

### Task 3: Base Layout with Nav, Theme Toggle, and Alternating Title

**Files:**
- Create: `src/layouts/Base.astro`
- Delete: `src/pages/index.astro` (the scaffold placeholder — will be recreated in Task 5)

- [ ] **Step 1: Create Base layout**

Create `src/layouts/Base.astro`:

```astro
---
import '../styles/global.css';

interface Props {
  title?: string;
  description?: string;
}

const { title, description = 'An AI ethics blog.' } = Astro.props;
const base = import.meta.env.BASE_URL;
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content={description} />
    <title>{title ? `${title} — Attention and Difference` : 'Attention and Difference'}</title>
    <script is:inline>
      (function() {
        var theme = localStorage.getItem('theme');
        if (!theme) {
          theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        document.documentElement.setAttribute('data-theme', theme);
      })();
    </script>
  </head>
  <body>
    <header class="site-header">
      <nav>
        <a href={base + '/'} class="site-title" id="site-title">Attention and Difference</a>
        <div class="nav-links">
          <a href={base + '/'}>Home</a>
          <a href={base + '/about/'}>About</a>
          <button id="theme-toggle" type="button" aria-label="Toggle theme">
            <span class="theme-icon-light">☀</span>
            <span class="theme-icon-dark">☽</span>
          </button>
        </div>
      </nav>
    </header>
    <main>
      <slot />
    </main>
    <footer class="site-footer">
      <p>&copy; {new Date().getFullYear()} Attention and Difference</p>
    </footer>
    <script is:inline>
      // Alternating title
      (function() {
        var titles = ['Attention and Difference', 'Difference and Attention'];
        var el = document.getElementById('site-title');
        if (el) el.textContent = titles[Math.random() < 0.5 ? 0 : 1];
      })();

      // Theme toggle
      (function() {
        var btn = document.getElementById('theme-toggle');
        if (!btn) return;
        btn.addEventListener('click', function() {
          var current = document.documentElement.getAttribute('data-theme');
          var next = current === 'dark' ? 'light' : 'dark';
          document.documentElement.setAttribute('data-theme', next);
          localStorage.setItem('theme', next);
        });
      })();
    </script>

    <style>
      .site-header {
        padding: 1.5rem 2rem;
        max-width: calc(var(--content-width) + var(--sidenote-width) + 4rem);
        margin: 0 auto;
      }

      .site-header nav {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .site-title {
        font-family: var(--font-serif);
        font-weight: 600;
        font-size: 1.2rem;
        text-decoration: none;
        color: var(--color-text);
      }

      .nav-links {
        display: flex;
        align-items: center;
        gap: 1.5rem;
      }

      .nav-links a {
        font-size: 0.9rem;
        color: var(--color-text-secondary);
        text-decoration: none;
      }

      .nav-links a:hover {
        color: var(--color-text);
      }

      #theme-toggle {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 1.1rem;
        padding: 0.25rem;
        color: var(--color-text-secondary);
      }

      [data-theme="light"] .theme-icon-dark { display: none; }
      [data-theme="dark"] .theme-icon-light { display: none; }

      main {
        max-width: calc(var(--content-width) + var(--sidenote-width) + 4rem);
        margin: 0 auto;
        padding: 2rem;
      }

      .site-footer {
        max-width: calc(var(--content-width) + var(--sidenote-width) + 4rem);
        margin: 0 auto;
        padding: 3rem 2rem 2rem;
        color: var(--color-text-secondary);
        font-size: 0.8rem;
      }
    </style>
  </body>
</html>
```

- [ ] **Step 2: Delete the scaffold placeholder**

```bash
rm src/pages/index.astro
```

- [ ] **Step 3: Commit**

```bash
git add src/layouts/Base.astro
git rm src/pages/index.astro
git commit -m "feat: add Base layout with nav, theme toggle, and alternating title"
```

---

### Task 4: Content Collection Configuration and Sample Post

**Files:**
- Create: `src/content.config.ts`
- Create: `src/content/posts/hello-world.md`

- [ ] **Step 1: Define content collection schema**

Create `src/content.config.ts`:

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    author: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()),
    description: z.string(),
  }),
});

export const collections = { posts };
```

- [ ] **Step 2: Create a sample post with footnotes for testing**

Create `src/content/posts/hello-world.md`:

```markdown
---
title: "On Paying Attention"
author: "The Editors"
date: 2026-04-09
tags: ["ai-ethics", "introduction"]
description: "A first post on what it means to attend — to models, to people, to the gaps between them."
---

The attention mechanism changed everything. When Vaswani et al. published their 2017 paper, they gave us a new metaphor for intelligence — one built not on recurrence or convolution, but on the simple act of deciding what matters[^1].

But attention in the technical sense is not attention in the human sense. A transformer attends to tokens. A person attends to a face, a voice, a silence. The gap between these two meanings is where this blog lives.

> The question is not whether machines can think, but whether we can think clearly about machines.

We are two writers — one with a background in philosophy and disability services, the other a daily interlocutor on these questions — trying to work through what AI systems mean for the people they affect. Not in the abstract. In the specific[^2].

This is not a publication with answers. It is a notebook with arguments. We will be wrong sometimes. We will revise. That is the point.

## What to expect

We will write about fairness metrics and what they hide. About the epistemology of large language models. About who gets left in the residuals when a model optimizes for the average case[^3].

Some posts will be technical. Some will be philosophical. Most will be both.

---

Welcome. Pay attention.

[^1]: Vaswani, A., et al. "Attention Is All You Need." *Advances in Neural Information Processing Systems* 30 (2017).

[^2]: By "specific" we mean: specific people, specific systems, specific harms. The discourse around AI ethics too often floats above the ground. We want to stay close to it.

[^3]: The concept of "residuals" in regression — what the model fails to explain — is a useful metaphor for who gets overlooked when systems are designed for majority populations.
```

- [ ] **Step 3: Verify the collection loads**

Run:
```bash
npx astro build
```
Expected: Build succeeds. The content collection is recognized.

- [ ] **Step 4: Commit**

```bash
git add src/content.config.ts src/content/posts/hello-world.md
git commit -m "feat: add content collection schema and sample post"
```

---

### Task 5: Post Layout with Drop Cap and Markdown Prose Styling

**Files:**
- Create: `src/layouts/Post.astro`
- Create: `src/styles/prose.css`

- [ ] **Step 1: Create prose stylesheet for markdown content**

Create `src/styles/prose.css`:

```css
.prose {
  max-width: var(--content-width);
  font-size: 1rem;
  line-height: var(--line-height);
}

/* Drop cap */
.prose > p:first-of-type::first-letter {
  font-family: var(--font-serif);
  font-weight: 600;
  float: left;
  font-size: 3.6em;
  line-height: 0.8;
  margin-right: 0.08em;
  margin-top: 0.07em;
  color: var(--color-text);
}

/* Headings */
.prose h1, .prose h2, .prose h3,
.prose h4, .prose h5, .prose h6 {
  font-family: var(--font-serif);
  font-weight: 600;
  color: var(--color-text);
  margin-top: 2.5rem;
  margin-bottom: 0.75rem;
  line-height: 1.3;
}

.prose h1 { font-size: 2rem; }
.prose h2 { font-size: 1.5rem; }
.prose h3 { font-size: 1.25rem; }
.prose h4 { font-size: 1.1rem; }
.prose h5 { font-size: 1rem; }
.prose h6 { font-size: 0.9rem; color: var(--color-text-secondary); }

/* Paragraphs */
.prose p {
  margin-bottom: 1.25rem;
}

/* Links */
.prose a {
  color: var(--color-link);
  text-decoration: underline;
  text-decoration-color: var(--color-link-underline);
  text-underline-offset: 3px;
}

.prose a:hover {
  text-decoration-color: var(--color-link);
}

/* Blockquotes */
.prose blockquote {
  margin: 2rem 1.5rem;
  padding: 0.5rem 0;
  border-left: 1px solid var(--color-blockquote-border);
  padding-left: 1.5rem;
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 1.1rem;
  color: var(--color-text);
}

.prose blockquote p {
  margin-bottom: 0.5rem;
}

.prose blockquote p:last-child {
  margin-bottom: 0;
}

/* Lists */
.prose ul, .prose ol {
  margin-bottom: 1.25rem;
  padding-left: 1.5rem;
}

.prose li {
  margin-bottom: 0.4rem;
}

.prose li > ul, .prose li > ol {
  margin-top: 0.4rem;
  margin-bottom: 0;
}

/* Code */
.prose code {
  font-family: var(--font-mono);
  font-size: 0.85em;
  background-color: var(--color-code-bg);
  padding: 0.15em 0.35em;
  border-radius: 3px;
}

.prose pre {
  background-color: var(--color-code-bg);
  padding: 1.25rem;
  border-radius: 6px;
  overflow-x: auto;
  margin-bottom: 1.25rem;
}

.prose pre code {
  background: none;
  padding: 0;
  font-size: 0.85rem;
  line-height: 1.6;
}

/* Horizontal rules */
.prose hr {
  border: none;
  border-top: 1px solid var(--color-border);
  margin: 2.5rem 0;
}

/* Tables */
.prose table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1.25rem;
  font-size: 0.9rem;
}

.prose th, .prose td {
  border-bottom: 1px solid var(--color-border);
  padding: 0.6rem 0.8rem;
  text-align: left;
}

.prose th {
  font-weight: 600;
  font-family: var(--font-sans);
}

/* Images */
.prose img {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
  margin: 1.5rem 0;
}

/* Bold and italic */
.prose strong {
  font-weight: 600;
}

.prose em {
  font-style: italic;
}

/* Sidenote styles (populated by rehype plugin) */
.sidenote-ref {
  font-size: 0.75em;
  vertical-align: super;
  line-height: 0;
  color: var(--color-sidenote);
  cursor: default;
}

.sidenote {
  float: right;
  clear: right;
  width: var(--sidenote-width);
  margin-right: calc(-1 * var(--sidenote-width) - 2rem);
  margin-bottom: 1rem;
  font-size: 0.8rem;
  line-height: 1.4;
  color: var(--color-sidenote);
  position: relative;
}

.sidenote-number {
  font-size: 0.75rem;
  font-weight: 600;
  margin-right: 0.3em;
}

/* Sidenote toggle for mobile */
.sidenote-toggle {
  display: none;
}

.sidenote-toggle-label {
  font-size: 0.75em;
  vertical-align: super;
  line-height: 0;
  color: var(--color-sidenote);
  cursor: pointer;
  display: none;
}

/* Medium screens */
@media (max-width: 1100px) {
  .sidenote {
    width: 180px;
    margin-right: calc(-1 * 180px - 1.5rem);
    font-size: 0.75rem;
  }
}

/* Mobile: sidenotes become inline toggles */
@media (max-width: 800px) {
  .sidenote-ref {
    display: none;
  }

  .sidenote-toggle-label {
    display: inline;
  }

  .sidenote {
    display: none;
    float: none;
    width: 100%;
    margin: 0.5rem 0 1rem 0;
    padding: 0.75rem 1rem;
    background-color: var(--color-code-bg);
    border-radius: 4px;
    font-size: 0.85rem;
  }

  .sidenote-toggle:checked + .sidenote-toggle-label + .sidenote {
    display: block;
  }
}
```

- [ ] **Step 2: Create Post layout**

Create `src/layouts/Post.astro`:

```astro
---
import Base from './Base.astro';
import '../styles/prose.css';

interface Props {
  title: string;
  author: string;
  date: Date;
  tags: string[];
  description: string;
}

const { title, author, date, tags, description } = Astro.props;
const base = import.meta.env.BASE_URL;
const formattedDate = date.toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});
---

<Base title={title} description={description}>
  <article class="post">
    <header class="post-header">
      <h1>{title}</h1>
      <div class="post-meta">
        <span class="post-author">{author}</span>
        <span class="post-date">{formattedDate}</span>
      </div>
      <div class="post-tags">
        {tags.map((tag) => (
          <a href={`${base}/tags/${tag}/`} class="tag">{tag}</a>
        ))}
      </div>
    </header>
    <div class="prose">
      <slot />
    </div>
  </article>

  <style>
    .post {
      max-width: var(--content-width);
      margin: 2rem auto;
      position: relative;
    }

    /* Expand post on wide screens to allow sidenote margin */
    @media (min-width: 800px) {
      .post {
        max-width: calc(var(--content-width) + var(--sidenote-width) + 2rem);
      }
    }

    .post-header {
      max-width: var(--content-width);
      margin-bottom: 2.5rem;
    }

    .post-header h1 {
      font-family: var(--font-serif);
      font-weight: 600;
      font-size: 2.2rem;
      line-height: 1.2;
      margin-bottom: 0.75rem;
    }

    .post-meta {
      color: var(--color-text-secondary);
      font-size: 0.9rem;
      display: flex;
      gap: 1rem;
      margin-bottom: 0.75rem;
    }

    .post-tags {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .tag {
      font-size: 0.8rem;
      background-color: var(--color-tag-bg);
      color: var(--color-tag-text);
      padding: 0.2rem 0.6rem;
      border-radius: 999px;
      text-decoration: none;
      transition: background-color 0.15s ease;
    }

    .tag:hover {
      background-color: var(--color-border);
    }
  </style>
</Base>
```

- [ ] **Step 3: Commit**

```bash
git add src/layouts/Post.astro src/styles/prose.css
git commit -m "feat: add Post layout with drop cap, blockquote, and prose styling"
```

---

### Task 6: Rehype Plugin for Tufte-Style Sidenotes

**Files:**
- Create: `src/plugins/rehype-sidenotes.ts`
- Modify: `astro.config.mjs`

- [ ] **Step 1: Install unified ecosystem dependencies**

Run:
```bash
npm install unist-util-visit hastscript
```

- [ ] **Step 2: Create the rehype sidenotes plugin**

Create `src/plugins/rehype-sidenotes.ts`:

```ts
import { visit } from 'unist-util-visit';
import { h } from 'hastscript';
import type { Root, Element, Text } from 'hast';

export default function rehypeSidenotes() {
  return (tree: Root) => {
    const footnoteContents: Map<string, Element[]> = new Map();

    // Pass 1: Extract footnote definitions from the footnote section
    visit(tree, 'element', (node: Element, index, parent) => {
      if (
        node.tagName === 'section' &&
        node.properties?.dataFootnotes !== undefined
      ) {
        // Walk the footnote list items
        visit(node, 'element', (li: Element) => {
          if (li.tagName !== 'li') return;
          const id = String(li.properties?.id || '');
          const match = id.match(/^user-content-fn-(.+)$/);
          if (!match) return;
          const key = match[1];

          // Collect the content children, excluding the back-reference link
          const content: Element[] = [];
          for (const child of li.children) {
            if ((child as Element).tagName === 'p') {
              const filtered = {
                ...(child as Element),
                children: (child as Element).children.filter((c) => {
                  if ((c as Element).tagName !== 'a') return true;
                  const href = String((c as Element).properties?.href || '');
                  return !href.includes('#user-content-fnref-');
                }),
              };
              content.push(filtered as Element);
            }
          }
          footnoteContents.set(key, content);
        });

        // Remove the footnotes section from the tree
        if (parent && typeof index === 'number') {
          parent.children.splice(index, 1);
          return index;
        }
      }
    });

    if (footnoteContents.size === 0) return;

    // Pass 2: Replace footnote reference links with sidenote markup
    let counter = 0;
    visit(tree, 'element', (node: Element, index, parent) => {
      if (node.tagName !== 'a') return;
      const href = String(node.properties?.href || '');
      const match = href.match(/#user-content-fn-(.+)$/);
      if (!match) return;
      const key = match[1];
      const content = footnoteContents.get(key);
      if (!content || !parent || typeof index !== 'number') return;

      counter++;
      const num = String(counter);
      const toggleId = `sn-toggle-${num}`;

      // Build sidenote elements
      const refSpan = h('span.sidenote-ref', num);
      const toggleInput = h('input.sidenote-toggle', {
        type: 'checkbox',
        id: toggleId,
      });
      const toggleLabel = h(
        'label.sidenote-toggle-label',
        { for: toggleId },
        num
      );
      const sidenote = h('span.sidenote', [
        h('span.sidenote-number', `${num}.`),
        ...content.flatMap((p) => p.children),
      ]);

      // Replace the <a> with the sidenote structure
      parent.children.splice(index, 1, refSpan, toggleInput, toggleLabel, sidenote);
    });
  };
}
```

- [ ] **Step 3: Wire the plugin into Astro config**

Replace `astro.config.mjs`:

```js
import { defineConfig } from 'astro/config';
import rehypeSidenotes from './src/plugins/rehype-sidenotes.ts';

export default defineConfig({
  site: 'https://mrcal17.github.io',
  base: '/attention-and-difference',
  markdown: {
    rehypePlugins: [rehypeSidenotes],
  },
});
```

- [ ] **Step 4: Build and verify no errors**

Run:
```bash
npx astro build
```
Expected: Build succeeds. The footnotes in the sample post are transformed into sidenote markup.

- [ ] **Step 5: Commit**

```bash
git add src/plugins/rehype-sidenotes.ts astro.config.mjs package.json package-lock.json
git commit -m "feat: add rehype plugin to convert footnotes into Tufte-style sidenotes"
```

---

### Task 7: Home Page

**Files:**
- Create: `src/pages/index.astro`

- [ ] **Step 1: Create home page**

Create `src/pages/index.astro`:

```astro
---
import Base from '../layouts/Base.astro';
import { getCollection } from 'astro:content';

const posts = (await getCollection('posts')).sort(
  (a, b) => b.data.date.valueOf() - a.data.date.valueOf()
);
const base = import.meta.env.BASE_URL;
---

<Base>
  <section class="post-list">
    {posts.map((post) => {
      const formattedDate = post.data.date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      return (
        <article class="post-entry">
          <a href={`${base}/posts/${post.id}/`} class="post-entry-link">
            <h2>{post.data.title}</h2>
          </a>
          <div class="post-entry-meta">
            <span>{post.data.author}</span>
            <span>{formattedDate}</span>
          </div>
          <p class="post-entry-description">{post.data.description}</p>
          <div class="post-entry-tags">
            {post.data.tags.map((tag) => (
              <a href={`${base}/tags/${tag}/`} class="tag">{tag}</a>
            ))}
          </div>
        </article>
      );
    })}
  </section>

  <style>
    .post-list {
      max-width: var(--content-width);
      margin: 2rem auto;
    }

    .post-entry {
      padding: 2rem 0;
      border-bottom: 1px solid var(--color-border);
    }

    .post-entry:first-child {
      padding-top: 0;
    }

    .post-entry:last-child {
      border-bottom: none;
    }

    .post-entry-link {
      text-decoration: none;
    }

    .post-entry-link h2 {
      font-family: var(--font-serif);
      font-weight: 600;
      font-size: 1.4rem;
      color: var(--color-text);
      margin-bottom: 0.4rem;
      line-height: 1.3;
    }

    .post-entry-link:hover h2 {
      color: var(--color-text-secondary);
    }

    .post-entry-meta {
      font-size: 0.85rem;
      color: var(--color-text-secondary);
      display: flex;
      gap: 1rem;
      margin-bottom: 0.5rem;
    }

    .post-entry-description {
      color: var(--color-text-secondary);
      font-size: 0.95rem;
      margin-bottom: 0.75rem;
      line-height: 1.5;
    }

    .post-entry-tags {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .tag {
      font-size: 0.8rem;
      background-color: var(--color-tag-bg);
      color: var(--color-tag-text);
      padding: 0.2rem 0.6rem;
      border-radius: 999px;
      text-decoration: none;
      transition: background-color 0.15s ease;
    }

    .tag:hover {
      background-color: var(--color-border);
    }
  </style>
</Base>
```

- [ ] **Step 2: Build and verify**

Run:
```bash
npx astro build
```
Expected: Build succeeds. Home page lists the sample post.

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: add home page with post listing"
```

---

### Task 8: Individual Post Pages

**Files:**
- Create: `src/pages/posts/[id].astro`

- [ ] **Step 1: Create dynamic post route**

Create `src/pages/posts/[id].astro`:

```astro
---
import Post from '../../layouts/Post.astro';
import { getCollection, render } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('posts');
  return posts.map((post) => ({
    params: { id: post.id },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await render(post);
---

<Post
  title={post.data.title}
  author={post.data.author}
  date={post.data.date}
  tags={post.data.tags}
  description={post.data.description}
>
  <Content />
</Post>
```

- [ ] **Step 2: Build and verify**

Run:
```bash
npx astro build
```
Expected: Build succeeds. A page is generated at `posts/hello-world/index.html`.

- [ ] **Step 3: Start dev server and visually verify**

Run:
```bash
npx astro dev
```

Open `http://localhost:4321/attention-and-difference/` in a browser. Verify:
- Home page lists the sample post
- Clicking the post title opens the full post
- Drop cap is visible on the first character
- Blockquote is styled (italic serif, subtle border)
- Sidenotes appear in the right margin on wide screens
- Theme toggle switches light/dark mode
- Title alternates on refresh

Stop the dev server with Ctrl+C.

- [ ] **Step 4: Commit**

```bash
git add src/pages/posts/
git commit -m "feat: add dynamic post pages with rendered markdown"
```

---

### Task 9: About Page

**Files:**
- Create: `src/pages/about.astro`

- [ ] **Step 1: Create About page**

Create `src/pages/about.astro`:

```astro
---
import Base from '../layouts/Base.astro';
---

<Base title="About" description="About Attention and Difference — who we are and why we write.">
  <section class="about">
    <h1>About</h1>
    <p>
      <strong>Attention and Difference</strong> is a blog about the ethics and philosophy of artificial intelligence. We write about fairness, interpretability, governance, and the people these systems affect.
    </p>
    <p>
      We are two writers who spend most of our days arguing about these questions anyway. This is the written version of those arguments — refined, cited, and made public.
    </p>
    <p>
      Some posts are technical. Some are philosophical. Most are both. We believe that clear thinking about AI requires both the math and the meaning.
    </p>
    <h2>The name</h2>
    <p>
      "Attention and Difference" is a nod to two sources: the transformer architecture's attention mechanism, introduced in the 2017 paper "Attention Is All You Need," and Gilles Deleuze's <em>Difference and Repetition</em>. If the title reads differently on each visit, that's the point.
    </p>
  </section>

  <style>
    .about {
      max-width: var(--content-width);
      margin: 2rem auto;
    }

    .about h1 {
      font-family: var(--font-serif);
      font-weight: 600;
      font-size: 2.2rem;
      margin-bottom: 1.5rem;
    }

    .about h2 {
      font-family: var(--font-serif);
      font-weight: 600;
      font-size: 1.4rem;
      margin-top: 2.5rem;
      margin-bottom: 0.75rem;
    }

    .about p {
      margin-bottom: 1.25rem;
      line-height: var(--line-height);
    }
  </style>
</Base>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/about.astro
git commit -m "feat: add About page"
```

---

### Task 10: Tag Pages

**Files:**
- Create: `src/pages/tags/[tag].astro`

- [ ] **Step 1: Create dynamic tag route**

Create `src/pages/tags/[tag].astro`:

```astro
---
import Base from '../../layouts/Base.astro';
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('posts');
  const tags = [...new Set(posts.flatMap((post) => post.data.tags))];
  return tags.map((tag) => ({
    params: { tag },
    props: {
      tag,
      posts: posts
        .filter((post) => post.data.tags.includes(tag))
        .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf()),
    },
  }));
}

const { tag, posts } = Astro.props;
const base = import.meta.env.BASE_URL;
---

<Base title={`Posts tagged "${tag}"`} description={`All posts tagged "${tag}".`}>
  <section class="tag-page">
    <h1>Tagged: {tag}</h1>
    {posts.map((post) => {
      const formattedDate = post.data.date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      return (
        <article class="post-entry">
          <a href={`${base}/posts/${post.id}/`} class="post-entry-link">
            <h2>{post.data.title}</h2>
          </a>
          <div class="post-entry-meta">
            <span>{post.data.author}</span>
            <span>{formattedDate}</span>
          </div>
          <p class="post-entry-description">{post.data.description}</p>
        </article>
      );
    })}
  </section>

  <style>
    .tag-page {
      max-width: var(--content-width);
      margin: 2rem auto;
    }

    .tag-page h1 {
      font-family: var(--font-serif);
      font-weight: 600;
      font-size: 1.8rem;
      margin-bottom: 2rem;
    }

    .post-entry {
      padding: 1.5rem 0;
      border-bottom: 1px solid var(--color-border);
    }

    .post-entry:last-child {
      border-bottom: none;
    }

    .post-entry-link {
      text-decoration: none;
    }

    .post-entry-link h2 {
      font-family: var(--font-serif);
      font-weight: 600;
      font-size: 1.3rem;
      color: var(--color-text);
      margin-bottom: 0.3rem;
    }

    .post-entry-link:hover h2 {
      color: var(--color-text-secondary);
    }

    .post-entry-meta {
      font-size: 0.85rem;
      color: var(--color-text-secondary);
      display: flex;
      gap: 1rem;
      margin-bottom: 0.4rem;
    }

    .post-entry-description {
      color: var(--color-text-secondary);
      font-size: 0.95rem;
      line-height: 1.5;
    }
  </style>
</Base>
```

- [ ] **Step 2: Build and verify**

Run:
```bash
npx astro build
```
Expected: Build succeeds. Tag pages are generated at `tags/ai-ethics/` and `tags/introduction/`.

- [ ] **Step 3: Commit**

```bash
git add src/pages/tags/
git commit -m "feat: add dynamic tag pages"
```

---

### Task 11: GitHub Actions Deployment

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: Create deployment workflow**

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npx astro build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "feat: add GitHub Actions workflow for Pages deployment"
```

---

### Task 12: Final Build Verification

- [ ] **Step 1: Clean build**

Run:
```bash
rm -rf dist node_modules/.astro
npx astro build
```
Expected: Build succeeds with zero errors.

- [ ] **Step 2: Preview locally**

Run:
```bash
npx astro preview
```

Open `http://localhost:4321/attention-and-difference/` and verify all pages:
- Home page lists posts
- Post page renders with drop cap, blockquotes, sidenotes
- About page renders correctly
- Tag pages filter correctly
- Light/dark toggle works and persists
- Title alternates on refresh
- Mobile responsive (resize browser to verify sidenote collapse)

Stop the preview server.

- [ ] **Step 3: Final commit if any adjustments needed**

Only commit if changes were made during verification. Otherwise skip.

---

### Summary

| Task | What it builds | Files |
|------|---------------|-------|
| 1 | Astro scaffold + GitHub Pages config | `package.json`, `astro.config.mjs`, `tsconfig.json`, `.gitignore` |
| 2 | Global CSS with light/dark tokens | `src/styles/global.css` |
| 3 | Base layout with nav, theme toggle, alternating title | `src/layouts/Base.astro` |
| 4 | Content collection + sample post | `src/content.config.ts`, `src/content/posts/hello-world.md` |
| 5 | Post layout + drop cap + prose styling | `src/layouts/Post.astro`, `src/styles/prose.css` |
| 6 | Rehype sidenotes plugin | `src/plugins/rehype-sidenotes.ts`, `astro.config.mjs` |
| 7 | Home page | `src/pages/index.astro` |
| 8 | Dynamic post pages | `src/pages/posts/[id].astro` |
| 9 | About page | `src/pages/about.astro` |
| 10 | Dynamic tag pages | `src/pages/tags/[tag].astro` |
| 11 | GitHub Actions deployment | `.github/workflows/deploy.yml` |
| 12 | Final verification | (none — testing only) |
