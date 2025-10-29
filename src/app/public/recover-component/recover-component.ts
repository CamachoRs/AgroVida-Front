import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PublicService } from '../../services/public.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-recover-component',
  imports: [FormsModule, RouterModule],
  templateUrl: './recover-component.html',
  styleUrl: './recover-component.css'
})
export class RecoverComponent {
  recoverEmail: string = "";

  constructor(private publicService: PublicService, private toastr: ToastrService) { };

  validations(): string[] {
    let errorMessages: string[] = [];
    if (!this.recoverEmail.trim() || this.recoverEmail.trim().length < 10 || this.recoverEmail.trim().length > 100) {
      errorMessages.push("El correo electrónico debe ser válido y tener al menos 10 caracteres.");
    };
    return errorMessages;
  };

  recover(form: NgForm) {
    const errorMessages = this.validations();
    if (errorMessages.length > 0) {
      errorMessages.forEach((message) => {
        this.toastr.error(message);
      });
    } else {
      this.publicService.recover(this.recoverEmail).subscribe({
        next: (responseCorrect) => {
          this.toastr.success(responseCorrect.message);
          form.resetForm();
          this.recoverEmail = "";
        },
        error: (responseError) => {
          if (responseError && responseError.error && responseError.error.errors) {
            const fieldsErrors = responseError.error.errors;
            for (const fields in fieldsErrors) {
              fieldsErrors[fields].forEach((message: string) => {
                this.toastr.error(message);
              });
            };
          } else if (responseError && responseError.error && responseError.error.message) {
            this.toastr.error(responseError.error.message);
          } else {
            this.toastr.error("Hubo un error al recuperar la contraseña.");
          };
        }
      });
    }
  };
}
