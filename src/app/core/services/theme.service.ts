import { Injectable, signal } from '@angular/core';

export type Theme = 'light' | 'dark' | 'system';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly theme = signal<Theme>(this.getStored());

  constructor() {
    this.apply(this.theme());
  }

  toggle(): void {
    const next = this.theme() === 'dark' ? 'light' : 'dark';
    this.setTheme(next);
  }

  setTheme(theme: Theme): void {
    this.theme.set(theme);
    this.apply(theme);
    localStorage.setItem('theme', theme);
  }

  private apply(theme: Theme): void {
    const root = document.documentElement;
    if (theme === 'system') {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', theme);
    }
  }

  private getStored(): Theme {
    return (localStorage.getItem('theme') as Theme) ?? 'system';
  }
}
