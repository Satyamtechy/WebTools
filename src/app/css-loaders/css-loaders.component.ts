import {
  Component,
  ChangeDetectionStrategy,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LoadersService } from './services/loaders.service';
import { LoaderCardComponent } from './components/loader-card/loader-card.component';
import { LoaderDetailModalComponent } from './components/loader-detail-modal/loader-detail-modal.component';
import { LoaderData, LoaderCategory } from '@shared/models/api.models';

const CATEGORIES: LoaderCategory[] = [
  'All', 'Bubble', 'Graph', 'Line', 'Progress', 'Rect', 'Skeleton', 'Text', 'Circle', 'Objects'
];

@Component({
  selector: 'app-css-loaders',
  standalone: true,
  templateUrl: './css-loaders.component.html',
  styleUrl: './css-loaders.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LoaderCardComponent, LoaderDetailModalComponent],
})
export class CssLoadersComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly loaderService = inject(LoadersService);

  readonly categories = CATEGORIES;
  readonly activeCategory = signal<LoaderCategory>('All');
  readonly loaders = signal<LoaderData[]>([]);
  readonly selectedLoader = signal<LoaderData | null>(null);

  ngOnInit(): void {
    this.loadLoaders();
  }

  selectCategory(cat: LoaderCategory): void {
    this.activeCategory.set(cat);
    this.loadLoaders();
  }

  openDetail(loader: LoaderData): void {
    this.selectedLoader.set(loader);
  }

  closeDetail(): void {
    this.selectedLoader.set(null);
  }

  private loadLoaders(): void {
    this.loaderService
      .getLoaders(this.activeCategory())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => this.loaders.set(
        data.filter(l => l.css && l.css.includes('.loader'))
      ));
  }
}
