import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PublicService {
  private urlBase = "http://192.168.101.11:8000/api";

  constructor(private http: HttpClient) { };

  register(newNameUser: string, newEmail: string, newPassword: string, newPhoneNumber: string, newNameEstate: string, newSideWalk: string, newMunicipality: string) {
    const data = {
      user: {
        nameUser: newNameUser.trim(),
        email: newEmail.trim(),
        password: newPassword.trim(),
        phoneNumber: newPhoneNumber.trim(),
      },
      establishment: {
        nameEstate: newNameEstate.trim(),
        sidewalk: newSideWalk.trim(),
        municipality: newMunicipality.trim(),
      }
    };

    return this.http.post<any>(`${this.urlBase}/register`, data);
  };

  login(loginEmail: string, loginPassword: string, id: string | null) {
    const url = id ? `${this.urlBase}/login/${id}` : `${this.urlBase}/login`;
    const data = {
      user: {
        email: loginEmail.trim(),
        password: loginPassword.trim()
      }
    };
    return this.http.post<any>(url, data);
  };

  recover(recoverEmail: string) {
    const data = {
      user: { email: recoverEmail.trim() }
    };
    return this.http.post<any>(`${this.urlBase}/recover`, data);
  };
}
