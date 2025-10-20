import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/User.model';

@Injectable({
  providedIn: 'root'
})
export class EmployService {
  private urlBase = "http://192.168.101.6:8000/api";

  constructor(private http: HttpClient) { };

  getEmployees() {
    return this.http.get<any>(`${this.urlBase}/employees`);
  };

  postEmploy(user: User) {
    const data = { user };
    return this.http.post<any>(`${this.urlBase}/employ`, data);
  };

  setEmploy(user: User, id: number = 0) {
    const data = { user }
    return this.http.put<any>(`${this.urlBase}/employ/${id}`, data);
  };

  deleteEmploy(id: number = 0) {
    return this.http.delete<any>(`${this.urlBase}/employ/${id}`);
  };
}
