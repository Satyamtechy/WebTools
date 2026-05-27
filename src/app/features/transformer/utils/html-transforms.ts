const SELF_CLOSING = new Set(['img', 'input', 'br', 'hr', 'meta', 'link', 'area', 'base', 'col', 'embed', 'source', 'track', 'wbr']);

function styleStringToObject(style: string): string {
  const props = style.split(';').filter(s => s.trim());
  const entries = props.map(s => {
    const [prop, ...rest] = s.split(':');
    const key = prop.trim().replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
    const val = rest.join(':').trim();
    return `${key}: '${val}'`;
  });
  return `{{ ${entries.join(', ')} }}`;
}

const EVENT_MAP: Record<string, string> = {
  onclick: 'onClick', ondblclick: 'onDoubleClick', onchange: 'onChange',
  onsubmit: 'onSubmit', onfocus: 'onFocus', onblur: 'onBlur',
  onkeydown: 'onKeyDown', onkeyup: 'onKeyUp', onmouseover: 'onMouseOver',
  onmouseout: 'onMouseOut', onmouseenter: 'onMouseEnter', onmouseleave: 'onMouseLeave',
};

export function htmlToJsx(html: string): string {
  let result = html;
  // class → className
  result = result.replace(/\bclass=/g, 'className=');
  // for → htmlFor
  result = result.replace(/\bfor=/g, 'htmlFor=');
  // style strings → objects
  result = result.replace(/style="([^"]*)"/g, (_, s: string) => `style=${styleStringToObject(s)}`);
  // event handlers
  Object.entries(EVENT_MAP).forEach(([html_attr, jsx_attr]) => {
    result = result.replace(new RegExp(`\\b${html_attr}=`, 'gi'), `${jsx_attr}=`);
  });
  // self-closing tags: <img ...> → <img ... />
  SELF_CLOSING.forEach(tag => {
    result = result.replace(new RegExp(`<(${tag})([^>]*?)\\s*/?>`, 'gi'), `<$1$2 />`);
  });
  // tabindex → tabIndex, colspan → colSpan, etc.
  result = result.replace(/\btabindex=/g, 'tabIndex=');
  result = result.replace(/\bcolspan=/g, 'colSpan=');
  result = result.replace(/\browspan=/g, 'rowSpan=');
  result = result.replace(/\bcellpadding=/g, 'cellPadding=');
  result = result.replace(/\bcellspacing=/g, 'cellSpacing=');
  return result;
}

const VUE_EVENT_MAP: Record<string, string> = {
  onclick: '@click', ondblclick: '@dblclick', onchange: '@change',
  onsubmit: '@submit', onfocus: '@focus', onblur: '@blur',
  onkeydown: '@keydown', onkeyup: '@keyup', onmouseover: '@mouseover',
  onmouseout: '@mouseout', onmouseenter: '@mouseenter', onmouseleave: '@mouseleave',
};

export function htmlToVue(html: string): string {
  let result = html;
  // events → @event
  Object.entries(VUE_EVENT_MAP).forEach(([html_attr, vue_attr]) => {
    result = result.replace(new RegExp(`\\b${html_attr}="([^"]*)"`, 'gi'), `${vue_attr}="$1"`);
  });
  // dynamic classes: class with binding indicators
  result = result.replace(/class="(\{[^"]*\})"/g, ':class="$1"');
  return result;
}
