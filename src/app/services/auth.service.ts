import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private urlBase = "http://192.168.101.5:8000/api";
  private isRefreshing: boolean = false;

  constructor(private http: HttpClient, private router: Router, private toastr: ToastrService) { };

  refreshToken() {
    return this.http.get<any>(`${this.urlBase}/refresh`);
  };

  autoRefresh() {
    const expires_in: number = parseInt(sessionStorage.getItem("expires_in") ?? "0");
    const refreshTime = expires_in - 10;

    if (refreshTime > 0 && !this.isRefreshing) {
      this.isRefreshing = true;
      setTimeout(() => {
        this.refreshToken().subscribe({
          next: (responseCorrect) => {
            this.isRefreshing = false;
            sessionStorage.setItem("access_token", responseCorrect.access_token);
            sessionStorage.setItem("expires_in", responseCorrect.expires_in);
            this.autoRefresh();
          },
          error: (responseError) => {
            this.toastr.error(responseError.message);
            this.router.navigate(["/"]);
          }
        });
      }, refreshTime * 1000);
    };
  };
}