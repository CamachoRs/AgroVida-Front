import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmployService {
  private urlBase = "http://192.168.101.9:8000/api";

  constructor(private http: HttpClient) { };

  getEmployees() {
    return this.http.get<any>(`${this.urlBase}/employees`);
  };

  postEmploy(employNameUser: string, employEmail: string, employPassword: string, employPhoneNumber: string, employStatus: boolean, employRole: string) {
    const data = {
      user: {
        nameUser: employNameUser.trim(),
        email: employEmail.trim(),
        password: employPassword.trim(),
        phoneNumber: employPhoneNumber.trim(),
        status: employStatus,
        role: employRole.trim()
      }
    };
    return this.http.post<any>(`${this.urlBase}/employ`, data);
  };

  setEmploy(employNameUser: string, employEmail: string, employPassword: string, employPhoneNumber: string, employStatus: boolean, employRole: string, id: number) {
    const data = {
      user: {
        nameUser: employNameUser.trim(),
        email: employEmail.trim(),
        password: employPassword.trim() ? employPassword.trim() : undefined,
        phoneNumber: employPhoneNumber.trim(),
        status: employStatus,
        role: employRole.trim()
      }
    }
    return this.http.put<any>(`${this.urlBase}/employ/${id}`, data);
  };

  deleteEmploy(id: number) {
    return this.http.delete<any>(`${this.urlBase}/employ/${id}`);
  };
}
