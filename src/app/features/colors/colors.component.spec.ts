import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ColorsComponent } from './colors.component';

describe('ColorsComponent', () => {
  let component: ColorsComponent;
  let fixture: ComponentFixture<ColorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColorsComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(ColorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('generates palettes from base color', () => {
    component.baseColor.set('#ff0000');
    const palettes = component.palettes();
    expect(palettes.length).toBe(4);
    expect(palettes[0].name).toBe('Complementary');
    expect(palettes[0].swatches.length).toBe(5);
    palettes.forEach(p => p.swatches.forEach(s => expect(s).toMatch(/^#[0-9a-f]{6}$/)));
  });

  it('copy sets feedback signal', async () => {
    spyOn(navigator.clipboard, 'writeText').and.returnValue(Promise.resolve());
    await component.copySwatch(0, 0);
    expect(component.copiedKey()).toBe('0-0');
  });
});
