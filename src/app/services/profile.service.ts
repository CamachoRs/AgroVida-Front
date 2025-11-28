import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private urlBase = "http://192.168.101.9:8000/api";

  constructor(private http: HttpClient) { };

  getUser() {
    return this.http.get<any>(`${this.urlBase}/profile`);
  };

  setUSer(profileNameUser: string, profileEmail: string, profilePassword: string, profilePhoneNumber: string, profileNameEstate: string, profileSideWalk: string, profileMunicipality: string) {
    const data = {
      user: {
        nameUser: profileNameUser.trim(),
        email: profileEmail.trim(),
        password: profilePassword.trim() ? profilePassword.trim() : undefined,
        phoneNumber: profilePhoneNumber.trim()
      },
      establishment: {
        nameEstate: profileNameEstate.trim(),
        sidewalk: profileSideWalk.trim(),
        municipality: profileMunicipality.trim()
      }
    };
    return this.http.put<any>(`${this.urlBase}/profile`, data);
  };
}
