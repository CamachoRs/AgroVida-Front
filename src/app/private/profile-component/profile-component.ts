import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NavComponent } from "../nav-component/nav-component";
import { FormsModule, NgForm } from '@angular/forms';
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
  role = sessionStorage.getItem("role") === "empleado";
  profileNameUser: string = "";
  profileEmail: string = "";
  profilePassword: string = "";
  profilePhoneNumber: string = "";
  profileRole: string = "";
  profileCreated_at: string = "";
  profileNameEstate: string = "";
  profileSidewalk: string = "";
  profileMunicipality: string = "";
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
    this.profileService.getUser().subscribe({
      next: (responseCorrect) => {
        this.profileNameUser = responseCorrect.user.nameUser;
        this.profileEmail = responseCorrect.user.email;
        this.profilePhoneNumber = responseCorrect.user.phoneNumber;
        this.profileRole = responseCorrect.user.role;
        this.profileCreated_at = responseCorrect.user.created_at.split("T")[0];
        this.profileNameEstate = responseCorrect.establishment.nameEstate;
        this.profileSidewalk = responseCorrect.establishment.sidewalk;
        this.profileMunicipality = responseCorrect.establishment.municipality;
        this.changeDetector.detectChanges();
      },
      error: (responseError) => {
        if (responseError && responseError.error && responseError.error.message) {
          this.toastr.error(responseError.error.message);
        } else if (responseError && responseError.message) {
          this.toastr.error(responseError.message);
        } else {
          this.toastr.error("Hubo un error al completar la información.");
        };
      }
    });
  };

  validations(): string[] {
    let errorMessages: string[] = [];
    const regexName = /^[A-Za-z\s]{3,50}$/;
    const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const regexPassword = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
    const regexPhoneNumber = /^(3[0-9]{9})$/;

    if (!this.profileNameUser.trim() || !regexName.test(this.profileNameUser.trim())) {
      errorMessages.push("El nombre de usuario debe contener solo letras y espacios, y tener al menos 3 caracteres.");
    };

    if (!this.profileEmail.trim() || !regexEmail.test(this.profileEmail.trim()) || this.profileEmail.trim().length < 10 || this.profileEmail.trim().length > 100) {
      errorMessages.push("El correo electrónico debe ser válido y tener al menos 10 caracteres.");
    };

    if (this.profilePassword.trim() && !regexPassword.test(this.profilePassword.trim())) {
      errorMessages.push("La contraseña debe tener al menos 8 caracteres, incluyendo una letra, un número y un símbolo especial.");
    };

    if (!this.profilePhoneNumber.trim() || !regexPhoneNumber.test(this.profilePhoneNumber.trim())) {
      errorMessages.push("El número de teléfono debe ser válido.");
    };

    if (!this.profileMunicipality.trim()) {
      errorMessages.push("Por favor, selecciona un municipio.");
    };

    if (!this.profileSidewalk.trim() || !regexName.test(this.profileSidewalk.trim())) {
      errorMessages.push("El nombre de la vereda debe contener solo letras y espacios, y tener al menos 3 caracteres.");
    };

    if (!this.profileNameEstate.trim() || !regexName.test(this.profileNameEstate.trim())) {
      errorMessages.push("El nombre de la finca debe contener solo letras y espacios, y al menos 3 caracteres.");
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
      this.profileService.setUSer(this.profileNameUser, this.profileEmail, this.profilePassword, this.profilePhoneNumber, this.profileNameEstate, this.profileSidewalk, this.profileMunicipality).subscribe({
        next: (responseCorrect) => {
          this.toastr.success(responseCorrect.message);
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
