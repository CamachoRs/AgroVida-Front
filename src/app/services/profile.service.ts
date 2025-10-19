import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/User.model';
import { Establishment } from '../models/Establishment.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private urlBase = "http://192.168.101.6:8000/api";

  constructor(private http: HttpClient) { };

  getUser(email: string | null) {
    const data = { email }
    return this.http.post<any>(`${this.urlBase}/profile`, data);
  };

  setUSer(user: User, establishment: Establishment) {
    const data = { user, establishment };
    return this.http.put<any>(`${this.urlBase}/profile`, data);
  };
}
