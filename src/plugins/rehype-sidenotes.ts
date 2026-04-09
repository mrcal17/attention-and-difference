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
