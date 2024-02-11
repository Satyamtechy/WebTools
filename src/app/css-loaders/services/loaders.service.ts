import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadersService {

  constructor(private http:HttpClient) { }

  getLoaders(): Observable<any>{
    return this.http.get<any>('https://webtools-pioz.onrender.com/api/LoadersControllers/GetAllLoaders')
  }
}
