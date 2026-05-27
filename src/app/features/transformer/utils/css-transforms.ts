const tailwindMap: Record<string, (v: string) => string> = {
  'display': v => ({ flex: 'flex', grid: 'grid', block: 'block', 'inline-block': 'inline-block', 'inline-flex': 'inline-flex', none: 'hidden', 'inline': 'inline' }[v] || v),
  'position': v => v,
  'color': v => `text-[${v}]`,
  'background-color': v => `bg-[${v}]`,
  'background': v => `bg-[${v}]`,
  'padding': v => `p-[${v}]`,
  'padding-top': v => `pt-[${v}]`,
  'padding-right': v => `pr-[${v}]`,
  'padding-bottom': v => `pb-[${v}]`,
  'padding-left': v => `pl-[${v}]`,
  'margin': v => `m-[${v}]`,
  'margin-top': v => `mt-[${v}]`,
  'margin-right': v => `mr-[${v}]`,
  'margin-bottom': v => `mb-[${v}]`,
  'margin-left': v => `ml-[${v}]`,
  'font-size': v => `text-[${v}]`,
  'font-weight': v => `font-[${v}]`,
  'border-radius': v => `rounded-[${v}]`,
  'width': v => `w-[${v}]`,
  'height': v => `h-[${v}]`,
  'max-width': v => `max-w-[${v}]`,
  'max-height': v => `max-h-[${v}]`,
  'min-width': v => `min-w-[${v}]`,
  'min-height': v => `min-h-[${v}]`,
  'gap': v => `gap-[${v}]`,
  'flex-direction': v => ({ column: 'flex-col', 'column-reverse': 'flex-col-reverse', row: 'flex-row', 'row-reverse': 'flex-row-reverse' }[v] || v),
  'justify-content': v => `justify-${v.replace('flex-', '').replace('space-between', 'between').replace('space-around', 'around').replace('space-evenly', 'evenly')}`,
  'align-items': v => `items-${v.replace('flex-', '')}`,
  'text-align': v => `text-${v}`,
  'overflow': v => `overflow-${v}`,
  'opacity': v => `opacity-[${v}]`,
  'cursor': v => `cursor-${v}`,
  'z-index': v => `z-[${v}]`,
  'border': v => `border-[${v}]`,
  'line-height': v => `leading-[${v}]`,
};

function parseCssDeclarations(css: string): { selector: string; props: [string, string][] }[] {
  const blocks: { selector: string; props: [string, string][] }[] = [];
  const ruleRegex = /([^{}]+)\{([^}]*)\}/g;
  let match: RegExpExecArray | null;
  while ((match = ruleRegex.exec(css)) !== null) {
    const selector = match[1].trim();
    const body = match[2].trim();
    const props: [string, string][] = [];
    body.split(';').forEach(decl => {
      const colon = decl.indexOf(':');
      if (colon === -1) return;
      const prop = decl.slice(0, colon).trim();
      const val = decl.slice(colon + 1).trim();
      if (prop && val) props.push([prop, val]);
    });
    if (props.length) blocks.push({ selector, props });
  }
  if (!blocks.length) {
    const props: [string, string][] = [];
    css.split(';').forEach(decl => {
      const colon = decl.indexOf(':');
      if (colon === -1) return;
      const prop = decl.slice(0, colon).trim().replace(/[{}]/g, '');
      const val = decl.slice(colon + 1).trim().replace(/[{}]/g, '');
      if (prop && val) props.push([prop, val]);
    });
    if (props.length) blocks.push({ selector: '', props });
  }
  return blocks;
}

export function cssToTailwind(css: string): string {
  const blocks = parseCssDeclarations(css);
  return blocks.map(({ selector, props }) => {
    const classes = props.map(([prop, val]) => {
      const mapper = tailwindMap[prop];
      return mapper ? mapper(val) : `/* ${prop}: ${val} */`;
    }).join(' ');
    return selector ? `/* ${selector} */\n${classes}` : classes;
  }).join('\n\n');
}

function toCamelCase(prop: string): string {
  return prop.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
}

export function cssToCssInJs(css: string): string {
  const blocks = parseCssDeclarations(css);
  return blocks.map(({ selector, props }) => {
    const entries = props.map(([prop, val]) => `  ${toCamelCase(prop)}: '${val}'`).join(',\n');
    const obj = `{\n${entries}\n}`;
    return selector ? `// ${selector}\nconst styles = ${obj};` : `const styles = ${obj};`;
  }).join('\n\n');
}

export function cssToScss(css: string): string {
  const blocks = parseCssDeclarations(css);
  const valueCounts: Record<string, number> = {};
  blocks.forEach(({ props }) => props.forEach(([, val]) => {
    valueCounts[val] = (valueCounts[val] || 0) + 1;
  }));
  const variables: Record<string, string> = {};
  let varIndex = 0;
  Object.entries(valueCounts).forEach(([val, count]) => {
    if (count >= 2 && val.length > 3) {
      variables[val] = `$var-${++varIndex}`;
    }
  });
  const varDecls = Object.entries(variables).map(([val, name]) => `${name}: ${val};`).join('\n');
  const rules = blocks.map(({ selector, props }) => {
    const body = props.map(([prop, val]) => `  ${prop}: ${variables[val] || val};`).join('\n');
    return selector ? `${selector} {\n${body}\n}` : body;
  }).join('\n\n');
  return varDecls ? `${varDecls}\n\n${rules}` : rules;
}
