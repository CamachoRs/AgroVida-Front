import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { User } from '../../models/user.model';
import { ToastrService } from 'ngx-toastr';
import { PublicService } from '../../services/public.service';
import { Establishment } from '../../models/establishment.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterModule],
  templateUrl: './register-component.html',
  styleUrl: './register-component.css'
})
export class RegisterComponent {
  newUser: User = {
    nameUser: "",
    email: "",
    password: "",
    phoneNumber: 0
  };

  newEstablishment: Establishment = {
    municipality: "",
    sidewalk: "",
    nameEstate: ""
  };

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

    if (this.newUser.nameUser?.trim() && this.newUser.email?.trim() && this.newUser.password?.trim() && this.newUser.phoneNumber) {
      if (!regexName.test(this.newUser.nameUser.trim())) {
        errorMessages.push("El nombre de usuario debe contener solo letras y espacios, y tener al menos 3 caracteres.");
      };

      if (!regexEmail.test(this.newUser.email.trim()) || this.newUser.email.trim().length < 10 || this.newUser.email.trim().length > 100) {
        errorMessages.push("El correo electrónico debe ser válido y tener al menos 10 caracteres.");
      };

      if (!regexPassword.test(this.newUser.password.trim())) {
        errorMessages.push("La contraseña debe tener al menos 8 caracteres, incluyendo una letra, un número y un símbolo especial.");
      };

      if (!regexPhoneNumber.test(this.newUser.phoneNumber.toString().trim())) {
        errorMessages.push("El número de teléfono debe ser válido.");
      };

      if (this.newEstablishment.municipality == "") {
        errorMessages.push("Por favor, selecciona un municipio.");
      };

      if (!regexName.test(this.newEstablishment.sidewalk.trim())) {
        errorMessages.push("El nombre de la vereda debe contener solo letras y espacios, y tener al menos 3 caracteres.");
      };

      if (!regexName.test(this.newEstablishment.nameEstate.trim())) {
        errorMessages.push("El nombre de la finca debe contener solo letras y espacios, y al menos 3 caracteres.");
      };
    } else {
      errorMessages.push("Por favor, completa todos los campos.");
    }
    return errorMessages;
  };

  register(form: NgForm) {
    const errorMessages = this.validations();
    if (errorMessages.length > 0) {
      errorMessages.forEach((message) => {
        this.toastr.error(message);
      });
    } else {
      this.publicService.register(this.newUser, this.newEstablishment).subscribe({
        next: (responseCorrect) => {
          this.toastr.success(responseCorrect.message);
          form.resetForm();
          this.newEstablishment.municipality = "";
        },
        error: (responserError) => {
          if (responserError && responserError.error && responserError.error.errors) {
            const fieldsErrors = responserError.error.errors;
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
