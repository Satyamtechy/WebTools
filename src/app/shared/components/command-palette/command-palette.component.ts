import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  HostListener,
  OnInit,
  DestroyRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime } from 'rxjs';
import { IconsService } from '../../../icons/services/icons.service';

interface PaletteItem {
  type: 'page' | 'icon' | 'action';
  label: string;
  description?: string;
  route?: string;
  icon?: string;
}

@Component({
  selector: 'app-command-palette',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './command-palette.component.html',
  styleUrl: './command-palette.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommandPaletteComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly iconsService = inject(IconsService);
  private readonly destroyRef = inject(DestroyRef);

  readonly open = signal(false);
  readonly query = signal('');
  readonly results = signal<PaletteItem[]>([]);
  readonly selectedIndex = signal(0);

  private readonly searchSubject = new Subject<string>();

  private readonly pages: PaletteItem[] = [
    { type: 'page', label: 'Icons', description: 'Browse 1300+ icons', route: '/icons' },
    { type: 'page', label: 'CSS Loaders', description: 'Animated loading indicators', route: '/css-loaders' },
    { type: 'page', label: 'Colors', description: 'Color palette generator', route: '/colors' },
    { type: 'page', label: 'Gradients', description: 'CSS gradient builder', route: '/gradients' },
    { type: 'page', label: 'Shadows', description: 'Box shadow generator', route: '/shadows' },
    { type: 'page', label: 'Radius', description: 'Border radius generator', route: '/radius' },
    { type: 'page', label: 'Fonts', description: 'Font preview and pairing', route: '/fonts' },
    { type: 'page', label: 'Meta Tags', description: 'Meta tag generator', route: '/meta-tags' },
    { type: 'page', label: 'Regex', description: 'Regex tester and reference', route: '/regex' },
    { type: 'page', label: 'JSON', description: 'JSON formatter and validator', route: '/json' },
    { type: 'page', label: 'Code Formatter', description: 'Format and beautify code', route: '/code-formatter' },
    { type: 'page', label: 'Image Base64', description: 'Convert images to Base64', route: '/image-base64' },
    { type: 'page', label: 'SVG Optimizer', description: 'Optimize SVG files', route: '/svg-optimizer' },
    { type: 'page', label: 'CSS Minifier', description: 'Minify CSS code', route: '/css-minifier' },
    { type: 'page', label: 'Tailwind Colors', description: 'Tailwind CSS color palette', route: '/tailwind-colors' },
    { type: 'page', label: 'Responsive Tester', description: 'Test responsive breakpoints', route: '/responsive-tester' },
    { type: 'page', label: 'Snippet Transformer', description: 'JSON to TypeScript, Zod, Go, Python, SQL, YAML', route: '/transformer' },
  ];

  private iconNames: string[] = [];

  ngOnInit(): void {
    this.iconsService.getCategories()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();

    this.searchSubject
      .pipe(debounceTime(150), takeUntilDestroyed(this.destroyRef))
      .subscribe((q) => this.search(q));

    this.iconsService.getAllIcons(1, 9999)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        this.iconNames = res.items.map((i) => i.svgName ?? '').filter(Boolean);
      });
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(e: KeyboardEvent): void {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      this.toggle();
    }
    if (!this.open()) return;
    if (e.key === 'Escape') this.close();
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.selectedIndex.set(Math.min(this.selectedIndex() + 1, this.results().length - 1));
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.selectedIndex.set(Math.max(this.selectedIndex() - 1, 0));
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      this.selectItem(this.results()[this.selectedIndex()]);
    }
  }

  toggle(): void {
    this.open.set(!this.open());
    if (this.open()) {
      this.query.set('');
      this.results.set(this.pages);
      this.selectedIndex.set(0);
    }
  }

  close(): void {
    this.open.set(false);
  }

  onInput(value: string): void {
    this.query.set(value);
    this.searchSubject.next(value);
  }

  selectItem(item: PaletteItem | undefined): void {
    if (!item) return;
    if (item.route) {
      this.router.navigateByUrl(item.route);
    }
    this.close();
  }

  private search(q: string): void {
    if (!q.trim()) {
      this.results.set(this.pages);
      this.selectedIndex.set(0);
      return;
    }
    const lower = q.toLowerCase();
    const pageResults = this.pages.filter(
      (p) => p.label.toLowerCase().includes(lower) || p.description?.toLowerCase().includes(lower)
    );
    const iconResults = this.iconNames
      .filter((name) => name.includes(lower))
      .slice(0, 8)
      .map((name): PaletteItem => ({
        type: 'icon',
        label: name,
        description: 'Icon',
        route: '/icons',
      }));
    this.results.set([...pageResults, ...iconResults]);
    this.selectedIndex.set(0);
  }
}
