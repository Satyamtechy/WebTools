import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeService } from '@core/services/theme.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  readonly themeService = inject(ThemeService);
  readonly toolsOpen = signal(false);

  private closeTimeout: ReturnType<typeof setTimeout> | null = null;

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
