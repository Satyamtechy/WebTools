import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { LoadersService } from './loaders.service';
import { environment } from '@env';

describe('LoadersService', () => {
  let service: LoadersService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/Loaders`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(LoadersService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('getLoaders with no category sends no params', () => {
    service.getLoaders().subscribe(res => expect(res.length).toBe(1));
    const req = httpMock.expectOne(baseUrl);
    expect(req.request.params.keys().length).toBe(0);
    req.flush([{ id: '1', html: '<div/>', css: '.x{}' }]);
  });

  it('getLoaders with category sends category param', () => {
    service.getLoaders('Bubble').subscribe();
    const req = httpMock.expectOne(r => r.url === baseUrl);
    expect(req.request.params.get('category')).toBe('bubble');
    req.flush([]);
  });

  it('getLoaders with "All" category sends no params', () => {
    service.getLoaders('All').subscribe();
    const req = httpMock.expectOne(baseUrl);
    expect(req.request.params.keys().length).toBe(0);
    req.flush([]);
  });

  it('getCategories returns string[]', () => {
    service.getCategories().subscribe(res => expect(res).toEqual(['Bubble', 'Line']));
    const req = httpMock.expectOne(`${baseUrl}/categories`);
    req.flush(['Bubble', 'Line']);
  });
});
