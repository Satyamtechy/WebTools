import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeFormatterComponent } from './code-formatter.component';

describe('CodeFormatterComponent', () => {
  let component: CodeFormatterComponent;
  let fixture: ComponentFixture<CodeFormatterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodeFormatterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CodeFormatterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
