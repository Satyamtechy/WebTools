import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoaderData, LoaderCategory } from '@shared/models/api.models';
import { environment } from '@env';

@Injectable({ providedIn: 'root' })
export class LoadersService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/Loaders`;

  getLoaders(category?: LoaderCategory): Observable<LoaderData[]> {
    let params = new HttpParams();
    if (category && category !== 'All') {
      params = params.set('category', category.toLowerCase());
    }
    return this.http.get<LoaderData[]>(this.baseUrl, { params });
  }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/categories`);
  }
}
