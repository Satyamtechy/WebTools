import {
  Component,
  ChangeDetectionStrategy,
  inject,
  input,
  computed,
  ViewEncapsulation,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-loader-card',
  standalone: true,
  template: `<div class="loader-preview" [innerHTML]="safeContent()"></div>`,
  styles: `
    app-loader-card { display: block; width: 100%; height: 100%; }
    .loader-preview {
      width: 100%;
      height: 100%;
      min-width: 120px;
      min-height: 120px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }
  `,
  encapsulation: ViewEncapsulation.ShadowDom,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoaderCardComponent {
  private readonly sanitizer = inject(DomSanitizer);

  readonly html = input.required<string>();
  readonly css = input.required<string>();
  readonly loaderId = input.required<string>();

  readonly safeContent = computed(() => {
    const id = this.loaderId();
    const scoped = this.css().replaceAll('.loader', `.loader-${id}`);
    const scopedHtml = this.html().replace('class="loader"', `class="loader-${id}"`);
    const baseStyle = `.loader-${id} { display: inline-block; position: relative; }`;
    return this.sanitizer.bypassSecurityTrustHtml(
      `<style>${baseStyle}\n${scoped}</style>${scopedHtml}`
    );
  });
}
