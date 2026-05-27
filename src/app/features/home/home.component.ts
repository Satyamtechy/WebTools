import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="hero">
      <h1>Developer Tools<br><span>That Just Work</span></h1>
      <p>1300+ icons, 280+ CSS loaders, and 15 utilities — all free, fast, and open source.</p>
      <div class="stats">
        <span>⌘K to search</span>
        <span>1300+ Icons</span>
        <span>280+ Loaders</span>
        <span>17 Tools</span>
        <span>Open Source</span>
      </div>
    </section>
    <section class="tools-grid">
      <a routerLink="/icons" class="tool-card">
        <h3>Icons</h3>
        <p>1300+ customizable SVG icons</p>
      </a>
      <a routerLink="/css-loaders" class="tool-card">
        <h3>CSS Loaders</h3>
        <p>280+ animated loading indicators</p>
      </a>
      <a routerLink="/transformer" class="tool-card">
        <h3>Snippet Transformer</h3>
        <p>JSON to TypeScript, Go, Python, SQL</p>
      </a>
      <a routerLink="/colors" class="tool-card">
        <h3>Color Palette</h3>
        <p>Generate palettes from any color</p>
      </a>
      <a routerLink="/gradients" class="tool-card">
        <h3>Gradients</h3>
        <p>CSS gradient builder</p>
      </a>
      <a routerLink="/shadows" class="tool-card">
        <h3>Box Shadow</h3>
        <p>Visual shadow generator</p>
      </a>
      <a routerLink="/radius" class="tool-card">
        <h3>Border Radius</h3>
        <p>Corner radius previewer</p>
      </a>
      <a routerLink="/json" class="tool-card">
        <h3>JSON Formatter</h3>
        <p>Format, minify, validate</p>
      </a>
      <a routerLink="/regex" class="tool-card">
        <h3>Regex Tester</h3>
        <p>Test patterns with live highlighting</p>
      </a>
      <a routerLink="/code-formatter" class="tool-card">
        <h3>Code Formatter</h3>
        <p>HTML, CSS, JS formatting</p>
      </a>
      <a routerLink="/css-minifier" class="tool-card">
        <h3>CSS Minifier</h3>
        <p>Minify and beautify CSS</p>
      </a>
      <a routerLink="/svg-optimizer" class="tool-card">
        <h3>SVG Optimizer</h3>
        <p>Reduce SVG file size</p>
      </a>
      <a routerLink="/image-base64" class="tool-card">
        <h3>Image to Base64</h3>
        <p>Convert images to data URI</p>
      </a>
      <a routerLink="/meta-tags" class="tool-card">
        <h3>Meta Tags</h3>
        <p>SEO meta tag generator</p>
      </a>
      <a routerLink="/fonts" class="tool-card">
        <h3>Font Pairing</h3>
        <p>Google Fonts combinations</p>
      </a>
      <a routerLink="/tailwind-colors" class="tool-card">
        <h3>Tailwind Colors</h3>
        <p>Full color reference</p>
      </a>
      <a routerLink="/responsive-tester" class="tool-card">
        <h3>Responsive Tester</h3>
        <p>Preview any URL at any size</p>
      </a>
    </section>
  `,
  styles: [`
    :host { display: block; }
    .hero {
      text-align: center;
      padding: 100px var(--space-8) 64px;
      max-width: 700px;
      margin: 0 auto;
      animation: fadeUp 0.6s ease both;
    }
    h1 {
      font-size: 3.5rem;
      font-weight: 800;
      color: var(--color-text);
      line-height: 1.05;
      letter-spacing: -0.04em;
      span { color: var(--color-primary); }
    }
    .hero p {
      margin-top: var(--space-5);
      font-size: 1.15rem;
      color: var(--color-text-secondary);
      line-height: 1.6;
    }
    .stats {
      margin-top: var(--space-6);
      display: flex;
      justify-content: center;
      gap: var(--space-4);
      flex-wrap: wrap;
      animation: fadeUp 0.6s ease 0.2s both;
      span {
        font-size: 0.8rem;
        color: var(--color-text-tertiary);
        &:not(:last-child)::after {
          content: '·';
          margin-left: var(--space-4);
          color: var(--color-border);
        }
      }
    }
    .tools-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: var(--space-4);
      max-width: 1100px;
      margin: 0 auto;
      padding: 0 var(--space-8) 100px;
    }
    .tool-card {
      padding: var(--space-5) var(--space-6);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      text-decoration: none;
      transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease, border-color 0.2s ease;
      opacity: 0;
      animation: fadeUp 0.5s ease forwards;
      &:hover {
        border-color: var(--color-primary);
        transform: translateY(-6px) scale(1.02);
        box-shadow: 0 12px 32px rgba(108, 58, 253, 0.08);
      }
      &:active { transform: translateY(-2px) scale(0.99); }
      h3 { color: var(--color-text); font-size: 0.95rem; font-weight: 600; }
      p { color: var(--color-text-tertiary); font-size: 0.8rem; margin-top: 4px; }
    }
    .tool-card:nth-child(1) { animation-delay: 0.1s; }
    .tool-card:nth-child(2) { animation-delay: 0.15s; }
    .tool-card:nth-child(3) { animation-delay: 0.2s; }
    .tool-card:nth-child(4) { animation-delay: 0.25s; }
    .tool-card:nth-child(5) { animation-delay: 0.3s; }
    .tool-card:nth-child(6) { animation-delay: 0.35s; }
    .tool-card:nth-child(7) { animation-delay: 0.4s; }
    .tool-card:nth-child(8) { animation-delay: 0.45s; }
    .tool-card:nth-child(9) { animation-delay: 0.5s; }
    .tool-card:nth-child(10) { animation-delay: 0.55s; }
    .tool-card:nth-child(11) { animation-delay: 0.6s; }
    .tool-card:nth-child(12) { animation-delay: 0.65s; }
    .tool-card:nth-child(13) { animation-delay: 0.7s; }
    .tool-card:nth-child(14) { animation-delay: 0.75s; }
    .tool-card:nth-child(15) { animation-delay: 0.8s; }
    .tool-card:nth-child(16) { animation-delay: 0.85s; }
    .tool-card:nth-child(17) { animation-delay: 0.9s; }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @media (prefers-reduced-motion: reduce) {
      .hero, .stats, .tool-card { animation: none; opacity: 1; }
    }
  `]
})
export class HomeComponent {}
