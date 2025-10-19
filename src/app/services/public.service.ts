import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/User.model';
import { Establishment } from '../models/Establishment.model';

@Injectable({
  providedIn: 'root'
})
export class PublicService {
  private urlBase = "http://192.168.101.6:8000/api";

  constructor(private http: HttpClient) { };

  register(user: User, establishment: Establishment) {
    const data = {
      user,
      establishment
    };

    return this.http.post<any>(`${this.urlBase}/register`, data);
  };

  login(user: User, id: string | null) {
    const url = id ? `${this.urlBase}/login/${id}` : `${this.urlBase}/login`;
    const data = { user };
    return this.http.post<any>(url, data);
  };

  recover(user: User) {
    const data = { user };
    return this.http.post<any>(`${this.urlBase}/recover`, data);
  };
}
