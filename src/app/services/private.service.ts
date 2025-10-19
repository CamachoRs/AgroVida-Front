import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class PrivateService {
  private urlBase = "http://192.168.101.6:8000/api";

  constructor(private http: HttpClient) { };

  logout() {
    return this.http.get<any>(`${this.urlBase}/logout`);
  };
}
