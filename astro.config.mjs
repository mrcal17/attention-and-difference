import { defineConfig } from 'astro/config';
import rehypeSidenotes from './src/plugins/rehype-sidenotes.ts';

export default defineConfig({
  site: 'https://mrcal17.github.io',
  base: '/attention-and-difference',
  markdown: {
    rehypePlugins: [rehypeSidenotes],
  },
});
