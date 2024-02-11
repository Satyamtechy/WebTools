import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FontsService {

  constructor(private http:HttpClient) { }

  getAllIcons(): Observable<any>{
    return this.http.get<any>('https://webtools-pioz.onrender.com/api/Icons/GetAllIcons')
  }
  getCategories(): Observable<any>{
    return this.http.get<any>('https://webtools-pioz.onrender.com/api/Icons/GetCategories')
  }
  getCategoryIcon(category:any): Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post<any>('https://webtools-pioz.onrender.com/api/Icons/GetCategoryIcons', category ,httpOptions)
  }
}
