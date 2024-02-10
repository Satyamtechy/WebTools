import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CssLoadersComponent } from './css-loaders.component';

describe('CssLoadersComponent', () => {
  let component: CssLoadersComponent;
  let fixture: ComponentFixture<CssLoadersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CssLoadersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CssLoadersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
