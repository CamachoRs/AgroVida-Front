import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NavComponent } from "../nav-component/nav-component";
import { FormsModule, NgForm } from '@angular/forms';
import { EmployService } from '../../services/employ.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users-component',
  imports: [NavComponent, FormsModule, CommonModule],
  templateUrl: './users-component.html',
  styleUrl: './users-component.css'
})
export class UsersComponent implements OnInit {
  activeLink = 'users';
  employId: number = -1;
  employNameUser: string = "";
  employEmail: string = "";
  employPassword: string = "";
  employPhoneNumber: string = "";
  employStatus: string = "";
  employRole: string = "";
  listUsers: any[] = [];

  constructor(private employService: EmployService, private toastr: ToastrService, private changeDetector: ChangeDetectorRef) { };

  ngOnInit(): void {
    this.getUsers()
  };

  resetinputs(): void {
    this.employId = -1;
    this.employNameUser = "";
    this.employEmail = "";
    this.employPassword = "";
    this.employPhoneNumber = "";
    this.employStatus = "";
    this.employRole = "";
  }

  activateTabItem(tab: string, employ: any | null) {
    if (employ) {
      this.employId = employ.id;
      this.employNameUser = employ.nameUser;
      this.employEmail = employ.email;
      this.employPhoneNumber = employ.phoneNumber;
      this.employRole = employ.role;
      this.employStatus = employ.status;
    } else {
      this.resetinputs();
    };

    const tabButton = document.getElementById(tab);
    if (tabButton) {
      tabButton.click();
    };
  };

  validations(isPasswordRequired: boolean): string[] {
    let errorMessages: string[] = [];
    const regexName = /^[A-Za-z\s]{3,50}$/;
    const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const regexPassword = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
    const regexPhoneNumber = /^(3[0-9]{9})$/;

    if (!this.employNameUser.trim() || !regexName.test(this.employNameUser.trim())) {
      errorMessages.push("El nombre de usuario debe contener solo letras y espacios, y tener al menos 3 caracteres.");
    };

    if (!this.employEmail.trim() || !regexEmail.test(this.employEmail.trim()) || this.employEmail.trim().length < 10 || this.employEmail.trim().length > 100) {
      errorMessages.push("El correo electrónico debe ser válido y tener al menos 10 caracteres.");
    };

    if (isPasswordRequired) {
      if (!this.employPassword.trim() || !regexPassword.test(this.employPassword.trim())) {
        errorMessages.push("La contraseña debe tener al menos 8 caracteres, incluyendo una letra, un número y un símbolo especial.");
      };
    } else {
      if (this.employPassword.trim() && !regexPassword.test(this.employPassword.trim())) {
        errorMessages.push("La contraseña debe tener al menos 8 caracteres, incluyendo una letra, un número y un símbolo especial.");
      };
    };

    if (!this.employPhoneNumber.trim() || !regexPhoneNumber.test(this.employPhoneNumber.trim())) {
      errorMessages.push("El número de teléfono debe ser válido.");
    };

    if (!this.employRole.trim()) {
      errorMessages.push("Por favor, selecciona un rol.");
    };

    return errorMessages;
  };

  postEmploy(form: NgForm) {
    const errorMessages = this.validations(true);
    if (errorMessages.length > 0) {
      errorMessages.forEach((message) => {
        this.toastr.error(message);
      });
    } else if (this.employId > 0) {
      this.toastr.error("No es posible añadir un usuario con características idénticas");
    } else {
      const status = this.employStatus === "true";
      this.employService.postEmploy(this.employNameUser, this.employEmail, this.employPassword, this.employPhoneNumber, status, this.employRole).subscribe({
        next: (responseCorrect) => {
          this.toastr.success(responseCorrect.message);
          form.resetForm();
          this.resetinputs();
          this.activateTabItem("nav-list-tab", null);
          this.getUsers();
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
            this.toastr.error("Hubo un error al crear el usuario.");
          };
        }
      });
    };
  };

  setEmploy(form: NgForm) {
    if (this.employId > 0) {
      const errorMessages = this.validations(false);
      if (errorMessages.length > 0) {
        errorMessages.forEach((message) => {
          this.toastr.error(message);
        });
      } else {
        const status = this.employStatus === "true";
        this.employService.setEmploy(this.employNameUser, this.employEmail, this.employPassword, this.employPhoneNumber, status, this.employRole, this.employId).subscribe({
          next: (responseCorrect) => {
            this.toastr.success(responseCorrect.message);
            form.resetForm();
            this.resetinputs();
            this.activateTabItem("nav-list-tab", null);
            this.getUsers();
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
    } else {
      this.toastr.error("¡Casi! Primero selecciona el usuario que deseas eliminar de la tabla.")
    };
  };

  deleteEmploy(form: NgForm) {
    if (this.employId > 0) {
      this.employService.deleteEmploy(this.employId).subscribe({
        next: (responseCorrect) => {
          this.toastr.success(responseCorrect.message);
          form.resetForm();
          this.resetinputs();
          this.activateTabItem("nav-list-tab", null);
          this.getUsers();
        },
        error: (responseError) => {
          this.toastr.error(responseError.message)
        }
      });
    } else {
      this.toastr.error("¡Casi! Primero selecciona el usuario que deseas eliminar de la tabla.")
    };
  };

  getUsers() {
    this.employService.getEmployees().subscribe({
      next: (responseCorrect) => {
        this.listUsers = responseCorrect.data;
        this.changeDetector.detectChanges();
      },
      error: (responseError) => {
        this.toastr.error(responseError.error.message);
      }
    });
  };
}