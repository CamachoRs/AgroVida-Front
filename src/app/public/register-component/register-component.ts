import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PublicService } from '../../services/public.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterModule],
  templateUrl: './register-component.html',
  styleUrl: './register-component.css'
})
export class RegisterComponent {
  newNameUser: string = "";
  newEmail: string = "";
  newPassword: string = "";
  newPhoneNumber: string = "";
  newMunicipality: string = "";
  newSidewalk: string = "";
  newNameEstate: string = "";
  municipalities: string[] = [
    "Neiva",
    "Aipe",
    "Algeciras",
    "Altamira",
    "Baraya",
    "Campoalegre",
    "Colombia",
    "El Agrado",
    "Elías",
    "Garzón",
    "Gigante",
    "Guadalupe",
    "Hobo",
    "Íquira",
    "La Argentina",
    "La Plata",
    "La Teora",
    "Nátaga",
    "Oporapa",
    "Paicol",
    "Pitalito",
    "Rivera",
    "Saladoblanco",
    "San Agustín",
    "San José de Isnos",
    "Santa María",
    "Suaza",
    "Tarqui",
    "Tesalia",
    "Timaná",
    "Tello",
    "Teruel",
    "Villavieja",
    "Yaguará",
    "La Victoria",
    "La Montañita",
    "La Palma"
  ];

  constructor(private publicService: PublicService, private toastr: ToastrService) { };

  validations(): string[] {
    let errorMessages: string[] = [];
    const regexName = /^[A-Za-z\s]{3,50}$/;
    const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const regexPassword = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
    const regexPhoneNumber = /^(3[0-9]{9})$/;

    if (!this.newNameUser.trim() || !regexName.test(this.newNameUser.trim())) {
      errorMessages.push("El nombre de usuario debe contener solo letras y espacios, y tener al menos 3 caracteres.");
    };

    if (!this.newEmail.trim() || !regexEmail.test(this.newEmail.trim()) || this.newEmail.trim().length < 10 || this.newEmail.trim().length > 100) {
      errorMessages.push("El correo electrónico debe ser válido y tener al menos 10 caracteres.");
    };

    if (!this.newPassword.trim() || !regexPassword.test(this.newPassword.trim())) {
      errorMessages.push("La contraseña debe tener al menos 8 caracteres, incluyendo una letra, un número y un símbolo especial.");
    };

    if (!this.newPhoneNumber.trim() || !regexPhoneNumber.test(this.newPhoneNumber.trim())) {
      errorMessages.push("El número de teléfono debe ser válido.");
    };

    if (!this.newMunicipality.trim()) {
      errorMessages.push("Por favor, selecciona un municipio.");
    };

    if (!this.newSidewalk.trim() || !regexName.test(this.newSidewalk.trim())) {
      errorMessages.push("El nombre de la vereda debe contener solo letras y espacios, y tener al menos 3 caracteres.");
    };

    if (!this.newNameEstate.trim() || !regexName.test(this.newNameEstate.trim())) {
      errorMessages.push("El nombre de la finca debe contener solo letras y espacios, y al menos 3 caracteres.");
    };
    return errorMessages;
  };

  register(form: NgForm) {
    const errorMessages = this.validations();
    if (errorMessages.length > 0) {
      errorMessages.forEach((message) => {
        this.toastr.error(message);
      });
    } else {
      this.publicService.register(this.newNameUser, this.newEmail, this.newPassword, this.newPhoneNumber, this.newNameEstate, this.newSidewalk, this.newMunicipality).subscribe({
        next: (responseCorrect) => {
          this.toastr.success(responseCorrect.message);
          form.resetForm();
          this.newNameUser = "";
          this.newEmail = "";
          this.newPassword = "";
          this.newPhoneNumber = "";
          this.newMunicipality = "";
          this.newSidewalk = "";
          this.newNameEstate = "";
        },
        error: (responseError) => {
          if (responseError && responseError.error && responseError.error.errors) {
            const fieldsErrors = responseError.error.errors;
            for (const field in fieldsErrors) {
              fieldsErrors[field].forEach((message: string) => {
                this.toastr.error(message);
              });
            };
          } else {
            this.toastr.error("Hubo un error al crear el usuario.");
          };
        }
      });
    };
  };
}
