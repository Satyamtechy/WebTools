interface RGB { r: number; g: number; b: number }
interface HSL { h: number; s: number; l: number }

function hexToRgb(hex: string): RGB {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map(c => c + c).join('') : h;
  return { r: parseInt(full.slice(0, 2), 16), g: parseInt(full.slice(2, 4), 16), b: parseInt(full.slice(4, 6), 16) };
}

function rgbToHsl(rgb: RGB): HSL {
  const r = rgb.r / 255, g = rgb.g / 255, b = rgb.b / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return { h: h * 360, s, l };
}

function linearize(c: number): number {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function rgbToOklch(rgb: RGB): { l: number; c: number; h: number } {
  const r = linearize(rgb.r / 255), g = linearize(rgb.g / 255), b = linearize(rgb.b / 255);
  const l_ = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m_ = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s_ = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_;
  const a = 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_;
  const bVal = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_;
  const c = Math.sqrt(a * a + bVal * bVal);
  const h = (Math.atan2(bVal, a) * 180) / Math.PI;
  return { l: L, c, h: h < 0 ? h + 360 : h };
}

function parseRgbString(str: string): RGB | null {
  const m = str.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  return m ? { r: +m[1], g: +m[2], b: +m[3] } : null;
}

function parseHslString(str: string): HSL | null {
  const m = str.match(/hsla?\(\s*([\d.]+)\s*,\s*([\d.]+)%?\s*,\s*([\d.]+)%?/);
  return m ? { h: +m[1], s: +m[2] / 100, l: +m[3] / 100 } : null;
}

function hslToRgb(hsl: HSL): RGB {
  const { h, s, l } = hsl;
  if (s === 0) { const v = Math.round(l * 255); return { r: v, g: v, b: v }; }
  const hue2rgb = (p: number, q: number, t: number): number => {
    const t2 = t < 0 ? t + 1 : t > 1 ? t - 1 : t;
    if (t2 < 1 / 6) return p + (q - p) * 6 * t2;
    if (t2 < 1 / 2) return q;
    if (t2 < 2 / 3) return p + (q - p) * (2 / 3 - t2) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return {
    r: Math.round(hue2rgb(p, q, h / 360 + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, h / 360) * 255),
    b: Math.round(hue2rgb(p, q, h / 360 - 1 / 3) * 255),
  };
}

function round(n: number, d = 2): number {
  return Math.round(n * 10 ** d) / 10 ** d;
}

export function isColor(input: string): boolean {
  const t = input.trim();
  return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(t) || /^rgba?\(/i.test(t) || /^hsla?\(/i.test(t);
}

export function colorTransform(input: string): string {
  const t = input.trim();
  let rgb: RGB;

  if (/^#/.test(t)) {
    rgb = hexToRgb(t);
  } else if (/^rgba?\(/i.test(t)) {
    const parsed = parseRgbString(t);
    if (!parsed) return 'Invalid RGB format';
    rgb = parsed;
  } else if (/^hsla?\(/i.test(t)) {
    const parsed = parseHslString(t);
    if (!parsed) return 'Invalid HSL format';
    rgb = hslToRgb(parsed);
  } else {
    return 'Unsupported color format';
  }

  const hex = `#${rgb.r.toString(16).padStart(2, '0')}${rgb.g.toString(16).padStart(2, '0')}${rgb.b.toString(16).padStart(2, '0')}`;
  const hsl = rgbToHsl(rgb);
  const oklch = rgbToOklch(rgb);

  return [
    `HEX:   ${hex}`,
    `RGB:   rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
    `HSL:   hsl(${round(hsl.h)}deg, ${round(hsl.s * 100)}%, ${round(hsl.l * 100)}%)`,
    `OKLCH: oklch(${round(oklch.l, 4)} ${round(oklch.c, 4)} ${round(oklch.h, 2)})`,
  ].join('\n');
}
