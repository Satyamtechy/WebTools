import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'cssFormat', standalone: true, pure: true })
export class CssFormatPipe implements PipeTransform {
  transform(css: string, format: 'css' | 'scss' | 'tailwind'): string {
    switch (format) {
      case 'scss':
        return this.toScss(css);
      case 'tailwind':
        return `@layer components {\n  ${css.replace(/\n/g, '\n  ')}\n}`;
      default:
        return css;
    }
  }

  private toScss(css: string): string {
    const colorRegex = /#[0-9a-fA-F]{3,8}\b/g;
    const colors = [...new Set(css.match(colorRegex) ?? [])];
    if (!colors.length) return css;

    let result = css;
    const vars = colors.map((c, i) => {
      const varName = `$color-${i + 1}`;
      result = result.replaceAll(c, varName);
      return `${varName}: ${c};`;
    });
    return vars.join('\n') + '\n\n' + result;
  }
}
