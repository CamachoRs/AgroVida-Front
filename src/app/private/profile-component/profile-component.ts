import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NavComponent } from "../nav-component/nav-component";
import { FormsModule, NgForm } from '@angular/forms';
import { User } from '../../models/User.model';
import { Establishment } from '../../models/Establishment.model';
import { ProfileService } from '../../services/profile.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile-component',
  imports: [NavComponent, FormsModule],
  templateUrl: './profile-component.html',
  styleUrl: './profile-component.css'
})
export class ProfileComponent implements OnInit {
  activeLink = "profile";
  editUser: User = {
    nameUser: "",
    email: "",
    password: "",
    phoneNumber: 0,
    role: "",
    created_at: ""
  };

  editEstablishment: Establishment = {
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

  constructor(private profileService: ProfileService, private toastr: ToastrService, private changeDetector: ChangeDetectorRef) { };

  ngOnInit(): void {
    this.getUser();
  };

  getUser() {
    const email = sessionStorage.getItem("email");
    this.profileService.getUser(email).subscribe({
      next: (responseCorrect) => {
        this.editUser = responseCorrect.user;
        this.editUser.created_at = responseCorrect.user.created_at.split("T")[0];
        this.editEstablishment = responseCorrect.establishment;
        this.changeDetector.detectChanges();
      },
      error: (responseError) => {
        this.toastr.error(responseError.message);
      }
    });
  };

  validations(): string[] {
    let errorMessages: string[] = [];
    const regexName = /^[A-Za-z\s]{3,50}$/;
    const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const regexPassword = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
    const regexPhoneNumber = /^(3[0-9]{9})$/;

    if (this.editUser.nameUser?.trim() && this.editUser.email?.trim() && this.editUser.phoneNumber) {
      if (!regexName.test(this.editUser.nameUser.trim())) {
        errorMessages.push("El nombre de usuario debe contener solo letras y espacios, y tener al menos 3 caracteres.");
      };

      if (!regexEmail.test(this.editUser.email.trim()) || this.editUser.email.trim().length < 10 || this.editUser.email.trim().length > 100) {
        errorMessages.push("El correo electrónico debe ser válido y tener al menos 10 caracteres.");
      };

      if (!regexPhoneNumber.test(this.editUser.phoneNumber.toString().trim())) {
        errorMessages.push("El número de teléfono debe ser válido.");
      };

      if (this.editEstablishment.municipality == "") {
        errorMessages.push("Por favor, selecciona un municipio.");
      };

      if (!regexName.test(this.editEstablishment.sidewalk.trim())) {
        errorMessages.push("El nombre de la vereda debe contener solo letras y espacios, y tener al menos 3 caracteres.");
      };

      if (!regexName.test(this.editEstablishment.nameEstate.trim())) {
        errorMessages.push("El nombre de la finca debe contener solo letras y espacios, y al menos 3 caracteres.");
      };
    } else {
      errorMessages.push("Por favor, completa todos los campos.");
    }

    if (this.editUser.password?.trim() && !regexPassword.test(this.editUser.password.trim())) {
      errorMessages.push("La contraseña debe tener al menos 8 caracteres, incluyendo una letra, un número y un símbolo especial.");
    };
    return errorMessages;
  };

  setUser(form: NgForm) {
    const errorMessages = this.validations();
    if (errorMessages.length > 0) {
      errorMessages.forEach((message) => {
        this.toastr.error(message);
      });
    } else {
      this.profileService.setUSer(this.editUser, this.editEstablishment).subscribe({
        next: (responseCorrect) => {
          this.toastr.success(responseCorrect.message);
          if (responseCorrect.email) {
            sessionStorage.setItem("email", responseCorrect.email);
          };
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
            this.toastr.error("Hubo un error al actualizar la información");
          };
        }
      });
    };
  };
}
