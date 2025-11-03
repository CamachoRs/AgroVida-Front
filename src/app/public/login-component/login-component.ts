import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { PublicService } from '../../services/public.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login-component',
  imports: [FormsModule, RouterModule],
  templateUrl: './login-component.html',
  styleUrl: './login-component.css'
})
export class LoginComponent implements OnInit {
  id: string | null = null;
  loginEmail: string = "";
  loginPassword: string = "";

  constructor(private publicService: PublicService, private toastr: ToastrService, private router: Router, private route: ActivatedRoute) { };

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id') || "";
    });
  };

  validations(): string[] {
    let errorMessages: string[] = [];
    const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!this.loginEmail.trim() || !regexEmail.test(this.loginEmail.trim()) || this.loginEmail.trim().length < 10 || this.loginEmail.trim().length > 100) {
      errorMessages.push("El correo electrónico debe ser válido y tener al menos 10 caracteres.");
    };

    if (!this.loginPassword.trim() || this.loginPassword.trim().length < 8) {
      errorMessages.push("La contraseña debe tener al menos 8 caracteres.");
    };

    return errorMessages;
  };

  login(form: NgForm) {
    const errorMessages = this.validations();
    if (errorMessages.length > 0) {
      errorMessages.forEach((message) => {
        this.toastr.error(message);
      });
    } else {
      this.publicService.login(this.loginEmail, this.loginPassword, this.id).subscribe({
        next: (responseCorrect) => {
          form.reset();
          this.loginEmail = "";
          this.loginPassword = "";
          sessionStorage.setItem("access_token", responseCorrect.access_token);
          sessionStorage.setItem("expires_in", responseCorrect.expires_in);
          this.router.navigate(["/tasks"]);
        },
        error: (responseError) => {
          if (responseError && responseError.error && responseError.error.errors) {
            const fieldsErrors = responseError.error.errors;
            for (const field in fieldsErrors) {
              fieldsErrors[field].forEach((message: string) => {
                this.toastr.error(message);
              });
            };
          } else if (responseError && responseError.error && responseError.error.message) {
            this.toastr.error(responseError.error.message);
          } else {
            this.toastr.error("Hubo un error al iniciar sesión.");
          };
        }
      });
    };
  };
}
