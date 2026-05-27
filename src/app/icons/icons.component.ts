import {
  Component,
  ChangeDetectionStrategy,
  DestroyRef,
  inject,
  OnInit,
  signal,
  computed,
  ChangeDetectorRef,
  ElementRef,
  AfterViewInit,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ColorPickerModule } from 'ngx-color-picker';
import { IconsService } from './services/icons.service';
import { IconData } from '@shared/models/api.models';
import { IconDetailPanelComponent } from '@features/icons/components/icon-detail-panel/icon-detail-panel.component';
import { ThemeService } from '@core/services/theme.service';

const BATCH_SIZE = 120;

@Component({
  selector: 'app-icons',
  standalone: true,
  templateUrl: './icons.component.html',
  styleUrl: './icons.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, ColorPickerModule, IconDetailPanelComponent],
})
export class IconsComponent implements OnInit, AfterViewInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly iconsService = inject(IconsService);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly themeService = inject(ThemeService);

  readonly color = signal('currentColor');
  readonly userChangedColor = signal(false);
  readonly strokeWidth = signal(2);
  readonly strokeSize = signal(24);
  readonly searchTerm = signal('');
  readonly activeCategory = signal('All Icons');
  readonly visibleCount = signal(BATCH_SIZE);

  allIcons = signal<IconData[]>([]);
  categories: string[] = [];
  selectedIcon: IconData | null = null;
  showDetail = false;

  private readonly searchSubject = new Subject<string>();
  private observer: IntersectionObserver | null = null;

  readonly sentinel = viewChild<ElementRef>('sentinel');

  readonly filteredIcons = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const all = this.allIcons();
    if (!term) return all;
    return all.filter((icon) => icon.svgName?.toLowerCase().includes(term));
  });

  readonly visibleIcons = computed(() => this.filteredIcons().slice(0, this.visibleCount()));

  ngOnInit(): void {
    this.loadAllIcons();
    this.loadCategories();
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((term) => {
        this.searchTerm.set(term);
        this.visibleCount.set(BATCH_SIZE);
        this.cdr.markForCheck();
      });
  }

  ngAfterViewInit(): void {
    this.setupIntersectionObserver();
  }

  onSearchInput(event: Event): void {
    this.searchSubject.next((event.target as HTMLInputElement).value);
  }

  loadAllIcons(): void {
    this.iconsService
      .getAllIcons(1, 9999)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        this.allIcons.set(res.items);
        this.activeCategory.set('All Icons');
        this.visibleCount.set(BATCH_SIZE);
        this.updateSvgContent();
      });
  }

  loadCategories(): void {
    this.iconsService
      .getCategories()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this.categories = data;
        this.cdr.markForCheck();
      });
  }

  selectCategory(category: string): void {
    if (category === 'All Icons') {
      this.loadAllIcons();
      return;
    }
    this.activeCategory.set(category);
    this.iconsService
      .getAllIcons(1, 9999, undefined, category)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        this.allIcons.set(res.items);
        this.visibleCount.set(BATCH_SIZE);
        this.updateSvgContent();
      });
  }

  onColorChange(newColor: string): void {
    this.color.set(newColor);
    this.userChangedColor.set(true);
    this.updateSvgContent();
  }

  onStrokeWidthChange(event: Event): void {
    this.strokeWidth.set(+(event.target as HTMLInputElement).value);
    this.updateSvgContent();
  }

  onStrokeSizeChange(event: Event): void {
    this.strokeSize.set(+(event.target as HTMLInputElement).value);
    this.updateSvgContent();
  }

  openDetail(icon: IconData): void {
    this.selectedIcon = icon;
    this.showDetail = true;
    this.cdr.markForCheck();
  }

  closeDetail(): void {
    this.showDetail = false;
    this.selectedIcon = null;
    this.cdr.markForCheck();
  }

  getSanitizedSvg(icon: IconData): SafeHtml {
    return icon.sanitizedSVGContent as unknown as SafeHtml;
  }

  private updateSvgContent(): void {
    const size = this.strokeSize();
    const width = this.strokeWidth();
    const col = this.color();
    const icons = this.allIcons();
    icons.forEach((icon) => {
      let svg = icon.svg;
      svg = svg.replace(/\bwidth="[^"]*"/, `width="${size}"`);
      svg = svg.replace(/\bheight="[^"]*"/, `height="${size}"`);
      svg = svg.replace(/\bstroke-width="[^"]*"/, `stroke-width="${width}"`);
      if (this.userChangedColor()) {
        svg = svg.replace(/\bstroke="[^"]*"/, `stroke="${col}"`);
      }
      icon.sanitizedSVGContent = this.sanitizer.bypassSecurityTrustHtml(svg) as string;
    });
    this.allIcons.set([...icons]);
  }

  private setupIntersectionObserver(): void {
    this.observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting && this.visibleCount() < this.filteredIcons().length) {
        this.visibleCount.update((v) => Math.min(v + BATCH_SIZE, this.filteredIcons().length));
        this.cdr.markForCheck();
      }
    }, { rootMargin: '200px' });

    // Observe after a tick to ensure the element is rendered
    setTimeout(() => {
      const el = this.sentinel()?.nativeElement;
      if (el) this.observer!.observe(el);
    });

    this.destroyRef.onDestroy(() => this.observer?.disconnect());
  }
}
