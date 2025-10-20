import { Component, ViewChild } from '@angular/core';
import { NavComponent } from "../nav-component/nav-component";
import { ItemComponent } from "./item-component/item-component";
import { User } from '../../models/User.model';
import { FormsModule, NgForm } from '@angular/forms';
import { EmployService } from '../../services/employ.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-users-component',
  imports: [NavComponent, ItemComponent, FormsModule],
  templateUrl: './users-component.html',
  styleUrl: './users-component.css'
})
export class UsersComponent {
  activeLink = 'users';
  @ViewChild(ItemComponent) itemComponent!: ItemComponent;

  listUsers: User[] = [];
  newUser: User = {
    id: 0,
    nameUser: "",
    email: "",
    phoneNumber: 0,
    role: "",
    status: true
  };

  constructor(private employService: EmployService, private toastr: ToastrService) { };

  activateTabItem(event: { tab: string, user: User }) {
    const { tab, user } = event;
    if (user) {
      this.newUser = { ...user };
    };

    const tabButton = document.getElementById(tab);
    if (tabButton) {
      tabButton.click();
    };
  };

  activateTab(tabId: string) {
    const tabButton = document.getElementById(tabId);
    if (tabButton) {
      tabButton.click();
    };
  };

  validations(password: string | undefined): string[] {
    let errorMessages: string[] = [];
    const regexName = /^[A-Za-z\s]{3,50}$/;
    const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const regexPassword = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
    const regexPhoneNumber = /^(3[0-9]{9})$/;

    if (this.newUser.nameUser?.trim() && this.newUser.email?.trim() && this.newUser.phoneNumber && this.newUser.role?.trim()) {
      if (!regexName.test(this.newUser.nameUser.trim())) {
        errorMessages.push("El nombre de usuario debe contener solo letras y espacios, y tener al menos 3 caracteres.");
      };

      if (!regexEmail.test(this.newUser.email.trim()) || this.newUser.email.trim().length < 10 || this.newUser.email.trim().length > 100) {
        errorMessages.push("El correo electrónico debe ser válido y tener al menos 10 caracteres.");
      };

      if (!regexPhoneNumber.test(this.newUser.phoneNumber.toString().trim())) {
        errorMessages.push("El número de teléfono debe ser válido.");
      };

      if (this.newUser.role.trim() == "") {
        errorMessages.push("Por favor, selecciona un rol.");
      };

      if (password?.trim() && !regexPassword.test(password.trim())) {
        errorMessages.push("La contraseña debe tener al menos 8 caracteres, incluyendo una letra, un número y un símbolo especial.");
      };
    } else {
      errorMessages.push("Por favor, completa todos los campos.");
    }

    return errorMessages;
  };

  postEmploy(form: NgForm) {
    const errorMessages = this.validations(this.newUser.password);
    if (errorMessages.length > 0) {
      errorMessages.forEach((message) => {
        this.toastr.error(message);
      });
    } else {
      this.employService.postEmploy(this.newUser).subscribe({
        next: (responseCorrect) => {
          this.toastr.success(responseCorrect.message);
          form.resetForm();
          this.newUser.role = "";
          this.activateTab("nav-list-tab");
          this.itemComponent.listUsers();
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

  setEmploy(form: NgForm) {
    if (this.newUser.id) {

      let errorMessages: string[];
      if (this.newUser.password?.trim()) {
        errorMessages = this.validations(this.newUser.password.trim());
      } else {
        errorMessages = this.validations(undefined);
      }

      if (errorMessages.length > 0) {
        errorMessages.forEach((message) => {
          this.toastr.error(message);
        });
      } else {
        if (typeof this.newUser.status === 'string') {
          this.newUser.status = (this.newUser.status === 'true');
        }
        this.employService.setEmploy(this.newUser, this.newUser.id).subscribe({
          next: (responseCorrect) => {
            this.toastr.success(responseCorrect.message);
            form.resetForm();
            this.newUser.role = "";
            this.activateTab("nav-list-tab");
            this.itemComponent.listUsers();
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
    if (this.newUser.id) {
      this.employService.deleteEmploy(this.newUser.id).subscribe({
        next: (responseCorrect) => {
          this.toastr.success(responseCorrect.message);
          form.resetForm();
          this.newUser.role = "";
          this.activateTab("nav-list-tab");
          this.itemComponent.listUsers();
        },
        error: (responseError) => {
          this.toastr.error(responseError.message)
        }
      });
    } else {
      this.toastr.error("¡Casi! Primero selecciona el usuario que deseas eliminar de la tabla.")
    };
  };
}