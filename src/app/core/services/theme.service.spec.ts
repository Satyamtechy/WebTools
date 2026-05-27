import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
  });

  it('default theme is system when nothing stored', () => {
    expect(service.theme()).toBe('system');
  });

  it('toggle switches between light and dark', () => {
    service.setTheme('dark');
    service.toggle();
    expect(service.theme()).toBe('light');
    service.toggle();
    expect(service.theme()).toBe('dark');
  });

  it('setTheme persists to localStorage', () => {
    service.setTheme('dark');
    expect(localStorage.getItem('theme')).toBe('dark');
  });

  it('applies data-theme attribute to document', () => {
    service.setTheme('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('removes data-theme when set to system', () => {
    service.setTheme('dark');
    service.setTheme('system');
    expect(document.documentElement.getAttribute('data-theme')).toBeNull();
  });
});
