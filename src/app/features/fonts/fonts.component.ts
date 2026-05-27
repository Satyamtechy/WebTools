import { Component, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface FontPair {
  heading: string;
  body: string;
}

const PAIRINGS: FontPair[] = [
  { heading: 'Playfair Display', body: 'Source Sans Pro' },
  { heading: 'Montserrat', body: 'Merriweather' },
  { heading: 'Oswald', body: 'Lato' },
  { heading: 'Raleway', body: 'Roboto' },
  { heading: 'Poppins', body: 'Open Sans' },
  { heading: 'Lora', body: 'Nunito' },
  { heading: 'Bebas Neue', body: 'Inter' },
  { heading: 'DM Serif Display', body: 'DM Sans' },
  { heading: 'Cormorant Garamond', body: 'Fira Sans' },
  { heading: 'Space Grotesk', body: 'Work Sans' },
];

@Component({
  selector: 'app-fonts',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './fonts.component.html',
  styleUrl: './fonts.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FontsComponent {
  private readonly doc = inject(DOCUMENT) as Document;

  readonly pairings = PAIRINGS;
  readonly selectedIndex = signal(0);
  readonly headingSize = signal(48);
  readonly bodySize = signal(18);
  readonly customHeading = signal('The quick brown fox jumps over the lazy dog');
  readonly customBody = signal('Typography is the art and technique of arranging type to make written language legible, readable, and appealing when displayed.');

  readonly selected = computed(() => this.pairings[this.selectedIndex()]);
  readonly copied = signal(false);

  private loadedFonts = new Set<string>();

  constructor() {
    this.pairings.forEach(p => {
      this.loadFont(p.heading);
      this.loadFont(p.body);
    });
  }

  select(index: number): void {
    this.selectedIndex.set(index);
  }

  private loadFont(name: string): void {
    if (this.loadedFonts.has(name)) return;
    this.loadedFonts.add(name);
    const link = this.doc.createElement('link');
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${name.replace(/ /g, '+')}:wght@400;700&display=swap`;
    this.doc.head.appendChild(link);
  }

  async copySnippet(): Promise<void> {
    const pair = this.selected();
    const h = pair.heading.replace(/ /g, '+');
    const b = pair.body.replace(/ /g, '+');
    const snippet = `<link href="https://fonts.googleapis.com/css2?family=${h}:wght@400;700&family=${b}:wght@400;700&display=swap" rel="stylesheet">

h1, h2, h3 { font-family: '${pair.heading}', serif; }
body { font-family: '${pair.body}', sans-serif; }`;
    await navigator.clipboard.writeText(snippet);
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 2000);
  }
}
