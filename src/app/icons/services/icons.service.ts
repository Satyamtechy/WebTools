import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { IconData, PaginatedResponse } from '@shared/models/api.models';
import { environment } from '@env';

@Injectable({ providedIn: 'root' })
export class IconsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/Icons`;

  private readonly categories$ = this.http.get<string[]>(`${this.baseUrl}/categories`).pipe(
    shareReplay(1)
  );

  getAllIcons(page = 1, pageSize = 60, search?: string, category?: string): Observable<PaginatedResponse<IconData>> {
    let params = new HttpParams()
      .set('page', page)
      .set('pageSize', pageSize);
    if (search) params = params.set('search', search);
    if (category) params = params.set('category', category);
    return this.http.get<PaginatedResponse<IconData>>(this.baseUrl, { params });
  }

  getIconByName(name: string): Observable<IconData> {
    return this.http.get<IconData>(`${this.baseUrl}/${name}`);
  }

  getCategories(): Observable<string[]> {
    return this.categories$;
  }
}
