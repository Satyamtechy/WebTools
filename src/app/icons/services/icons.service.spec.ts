import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { IconsService } from './icons.service';
import { environment } from '@env';

describe('IconsService', () => {
  let service: IconsService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/Icons`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(IconsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('getAllIcons returns PaginatedResponse', () => {
    const mockResponse = { items: [{ svg: '<svg/>' }], totalCount: 1, page: 1, pageSize: 60 };
    service.getAllIcons().subscribe(res => {
      expect(res.items.length).toBe(1);
      expect(res.totalCount).toBe(1);
      expect(res.page).toBe(1);
    });
    const req = httpMock.expectOne(r => r.url === baseUrl);
    expect(req.request.params.get('page')).toBe('1');
    expect(req.request.params.get('pageSize')).toBe('60');
    req.flush(mockResponse);
  });

  it('getCategories returns string[]', () => {
    const mockCategories = ['Arrows', 'Media', 'Social'];
    service.getCategories().subscribe(res => {
      expect(res).toEqual(mockCategories);
    });
    const req = httpMock.expectOne(`${baseUrl}/categories`);
    req.flush(mockCategories);
  });

  it('getIconByName calls correct URL', () => {
    service.getIconByName('arrow-right').subscribe();
    const req = httpMock.expectOne(`${baseUrl}/arrow-right`);
    expect(req.request.method).toBe('GET');
    req.flush({ svg: '<svg/>' });
  });
});
