import { CssFormatPipe } from './css-format.pipe';

describe('CssFormatPipe', () => {
  const pipe = new CssFormatPipe();

  it('css format returns input unchanged', () => {
    const input = '.loader { color: red; }';
    expect(pipe.transform(input, 'css')).toBe(input);
  });

  it('scss extracts color variables', () => {
    const input = '.a { color: #ff0000; background: #00ff00; }';
    const result = pipe.transform(input, 'scss');
    expect(result).toContain('$color-1: #ff0000;');
    expect(result).toContain('$color-2: #00ff00;');
    // The rule block should use variables, not raw hex
    expect(result).toContain('color: $color-1');
    expect(result).toContain('background: $color-2');
  });

  it('tailwind wraps in @layer components', () => {
    const input = '.loader { display: flex; }';
    const result = pipe.transform(input, 'tailwind');
    expect(result).toContain('@layer components {');
    expect(result).toContain('.loader { display: flex; }');
    expect(result.endsWith('}')).toBeTrue();
  });
});
