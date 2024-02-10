import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoaderDetailPopupComponent } from './loader-detail-popup.component';

describe('LoaderDetailPopupComponent', () => {
  let component: LoaderDetailPopupComponent;
  let fixture: ComponentFixture<LoaderDetailPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoaderDetailPopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoaderDetailPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
