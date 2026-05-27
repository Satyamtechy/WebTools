import { Component, ChangeDetectionStrategy, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeService } from '@core/services/theme.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  readonly themeService = inject(ThemeService);
  readonly toolsOpen = signal(false);
  readonly isHome = signal(this.router.url === '/');

  private closeTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe((e) => this.isHome.set(e.urlAfterRedirects === '/'));
  }

  openPalette(): void {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }));
  }

  toggleTools(): void {
    this.toolsOpen.set(!this.toolsOpen());
  }

  onToolsEnter(): void {
    if (this.closeTimeout) {
      clearTimeout(this.closeTimeout);
      this.closeTimeout = null;
    }
    this.toolsOpen.set(true);
  }

  closeTools(): void {
    this.closeTimeout = setTimeout(() => this.toolsOpen.set(false), 150);
  }
}
