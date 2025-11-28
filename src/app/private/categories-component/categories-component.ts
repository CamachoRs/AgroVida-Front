import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NavComponent } from "../nav-component/nav-component";
import { CategoriesService } from '../../services/categories.service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-categories-component',
  imports: [NavComponent, FormsModule],
  templateUrl: './categories-component.html',
  styleUrl: './categories-component.css'
})
export class CategoriesComponent implements OnInit {
  activeLink = "category";
  categoryItems: any[] = [];
  id: number = -1;
  name: string = "";
  description: string = "";
  source: string = "";

  constructor(private categoryService: CategoriesService, private toastr: ToastrService, private changeDetector: ChangeDetectorRef) { };

  ngOnInit(): void {
    this.getCategories();
  };

  resetInputs(): void {
    this.id = -1;
    this.name = "";
    this.description = "";
    this.source = "";
  };

  activateTabItem(tab: string, product: any | null) {
    if (product) {
      this.id = product.id;
      this.name = product.name;
      this.description = product.description;
      this.source = product.source;
    } else { this.resetInputs(); };

    const tabButton = document.getElementById(tab);
    if (tabButton) {
      tabButton.click();
    };
  };

  validations(): string[] {
    let errorMessages: string[] = [];
    const regexName = /^[A-Za-z\s]{3,50}$/;

    if (!this.name.trim() || !regexName.test(this.name.trim())) {
      errorMessages.push("El nombre del producto debe contener solo letras y espacios, y tener al menos 3 caracteres.");
    };

    if (!this.source.trim()) {
      errorMessages.push("Por favor, selecciona el tipo de categoría");
    };

    return errorMessages;
  };

  postCategories(form: NgForm): void {
    if (this.source == "producto") {
      this.postProductCategory(form);
    } else if (this.source == "animal") {
      this.postAnimalCategory(form);
    };
  };

  postProductCategory(form: NgForm): void {
    const errorMessages = this.validations();
    if (errorMessages.length > 0) {
      errorMessages.forEach((message) => {
        this.toastr.error(message);
      });
    } else if (this.id > 0) {
      this.toastr.error("No es posible añadir una cateogría con características similares");
    } else {
      this.categoryService.postProductCategory(this.name, this.description).subscribe({
        next: (responseCorrect) => {
          this.toastr.success(responseCorrect.message);
          form.resetForm();
          this.resetInputs();
          this.activateTabItem('nav-list-tab', null);
          this.getCategories();
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
            this.toastr.error("Hubo un error registrar el producto.");
          };
        }
      });
    };
  };

  postAnimalCategory(form: NgForm): void {
    const errorMessages = this.validations();
    if (errorMessages.length > 0) {
      errorMessages.forEach((message) => {
        this.toastr.error(message);
      });
    } else if (this.id > 0) {
      this.toastr.error("No es posible añadir una cateogría con características similares");
    } else {
      this.categoryService.postAnimalCategory(this.name, this.description).subscribe({
        next: (responseCorrect) => {
          this.toastr.success(responseCorrect.message);
          form.resetForm();
          this.resetInputs();
          this.activateTabItem('nav-list-tab', null);
          this.getCategories();
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
            this.toastr.error("Hubo un error registrar el producto.");
          };
        }
      });
    };
  };

  putCategories(form: NgForm): void {
    if (this.source == "producto") {
      this.putProductCategory(form);
    } else if (this.source == "animal") {
      this.putAnimalCategory(form);
    };
  };

  putProductCategory(form: NgForm): void {
    const errorMessages = this.validations();
    if (errorMessages.length > 0) {
      errorMessages.forEach((message) => {
        this.toastr.error(message);
      });
    } else if (this.id < 0) {
      this.toastr.error("¡Casi! Primero selecciona la categoría que deseas eliminar de la tabla.")
    } else {
      this.categoryService.putProductCategory(this.name, this.description, this.id).subscribe({
        next: (responseCorrect) => {
          this.toastr.success(responseCorrect.message);
          form.resetForm();
          this.resetInputs();
          this.activateTabItem('nav-list-tab', null);
          this.getCategories();
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
            this.toastr.error("Hubo un error registrar el producto.");
          };
        }
      });
    };
  };

  putAnimalCategory(form: NgForm): void {
    const errorMessages = this.validations();
    if (errorMessages.length > 0) {
      errorMessages.forEach((message) => {
        this.toastr.error(message);
      });
    } else if (this.id < 0) {
      this.toastr.error("¡Casi! Primero selecciona la categoría que deseas eliminar de la tabla.")
    } else {
      this.categoryService.putAnimalCategory(this.name, this.description, this.id).subscribe({
        next: (responseCorrect) => {
          this.toastr.success(responseCorrect.message);
          form.resetForm();
          this.resetInputs();
          this.activateTabItem('nav-list-tab', null);
          this.getCategories();
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
            this.toastr.error("Hubo un error registrar el producto.");
          };
        }
      });
    };
  };

  deleteCategories(form: NgForm): void {
    if (this.source == "producto") {
      this.deleteProductCategory(form);
    } else if (this.source == "animal") {
      this.deleteAnimalCategory(form);
    };
  };

  deleteProductCategory(form: NgForm) {
    if (this.id > 0) {
      this.categoryService.deleteProductCategory(this.id).subscribe({
        next: (responseCorrect) => {
          this.toastr.success(responseCorrect.message);
          form.resetForm();
          this.resetInputs();
          this.activateTabItem('nav-list-tab', null);
          this.getCategories();
        },
        error: (responseError) => {
          this.toastr.error(responseError.message)
        }
      });
    } else {
      this.toastr.error("¡Casi! Primero selecciona la cateogría que deseas eliminar de la tabla")
    };
  };

  deleteAnimalCategory(form: NgForm) {
    if (this.id > 0) {
      this.categoryService.deleteAnimalCategory(this.id).subscribe({
        next: (responseCorrect) => {
          this.toastr.success(responseCorrect.message);
          form.resetForm();
          this.resetInputs();
          this.activateTabItem('nav-list-tab', null);
          this.getCategories();
        },
        error: (responseError) => {
          this.toastr.error(responseError.message)
        }
      });
    } else {
      this.toastr.error("¡Casi! Primero selecciona la cateogría que deseas eliminar de la tabla")
    };
  };

  getCategories(): void {
    this.categoryItems = [];
    this.categoryService.getProductCategory().subscribe({
      next: (responseCorrect) => {
        for (let i of responseCorrect.data) {
          i.source = "producto";
          this.categoryItems.push(i);
        };
        this.changeDetector.detectChanges();
      },
      error: (responseError) => {
        this.toastr.error(responseError.error.message);
      }
    });

    this.categoryService.getAnimalCategory().subscribe({
      next: (responseCorrect) => {
        for (let i of responseCorrect.data) {
          i.source = "animal";
          this.categoryItems.push(i);
        };
        this.changeDetector.detectChanges();
      },
      error: (responseError) => {
        this.toastr.error(responseError.error.message);
      }
    });
  };
}
