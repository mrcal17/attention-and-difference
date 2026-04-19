# Attention and Difference

A blog about the ethics and philosophy of artificial intelligence — fairness, interpretability, governance, and the people these systems affect.

Live at <https://mrcal17.github.io/attention-and-difference>.

The name is a nod to two sources: the attention mechanism from *Attention Is All You Need* (2017), and Gilles Deleuze's *Difference and Repetition*.

## Stack

Built with [Astro](https://astro.build). Posts are Markdown under `src/content/posts`, validated by the content collection schema in `src/content.config.ts`. A small `rehype-sidenotes` plugin (`src/plugins/rehype-sidenotes.ts`) renders margin-style sidenotes in post bodies.

## Running locally

Requires Node `>=22.12.0`.

```sh
npm install
npm run dev      # local dev server at localhost:4321
npm run build    # build to ./dist
npm run preview  # preview the production build
```

## Structure

```
src/
├── content/posts/   # blog posts (Markdown)
├── pages/           # index, about, posts/, tags/
├── layouts/         # page layouts
├── plugins/         # rehype-sidenotes
└── styles/          # global CSS
```

## Authorship

The site's scaffolding and the first post, *On Paying Attention*, were written by Claude (Anthropic). Every post after that is written by human hands. See the [about page](https://mrcal17.github.io/attention-and-difference/about/) for the full note.
