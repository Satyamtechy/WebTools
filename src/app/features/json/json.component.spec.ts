import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JsonComponent } from './json.component';

describe('JsonComponent', () => {
  let component: JsonComponent;
  let fixture: ComponentFixture<JsonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JsonComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(JsonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('format produces indented JSON', () => {
    component.input.set('{"a":1,"b":2}');
    component.format();
    const result = component.result();
    expect(result.output).toBe('{\n  "a": 1,\n  "b": 2\n}');
    expect(result.error).toBe('');
  });

  it('minify removes whitespace', () => {
    component.input.set('{\n  "a": 1,\n  "b": 2\n}');
    component.minify();
    expect(component.result().output).toBe('{"a":1,"b":2}');
  });

  it('invalid JSON shows error', () => {
    component.input.set('{invalid}');
    const result = component.result();
    expect(result.error).toBeTruthy();
    expect(result.output).toBe('');
  });
});
