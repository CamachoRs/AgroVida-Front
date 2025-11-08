import { ChangeDetectorRef, Component } from '@angular/core';
import { NavComponent } from "../nav-component/nav-component";
import { AnimalService } from '../../services/animal.service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-animals-component',
  imports: [NavComponent, FormsModule],
  templateUrl: './animals-component.html',
  styleUrl: './animals-component.css'
})
export class AnimalsComponent {
  activeLink = "animals";
  animalsItems: any[] = [];
  categoryId: number = -1;
  name: string = "";
  sex: string = "";
  healthStatus: string = "";
  ageRange: string = "";
  weight: number = 0;
  observations: string | undefined = undefined;
  image: File | undefined = undefined;
  id: number = -1;
  createdAt: string = "";
  animalCategories: any[] = []

  constructor(private animalService: AnimalService, private toastr: ToastrService, private changeDetector: ChangeDetectorRef) { };

  ngOnInit(): void {
    const today = new Date();
    this.createdAt = today.toISOString().split('T')[0];
    this.getAnimals();
    this.getAnimalCategories();
  };

  resetInputs(): void {
    this.categoryId = -1;
    this.name = "";
    this.sex = "";
    this.healthStatus = "";
    this.ageRange = "";
    this.weight = 0;
    this.observations = undefined;
    this.image = undefined;
    this.id = -1;
    this.createdAt = "";
  };

  activateTabItem(tab: string, animal: any | null) {
    if (animal) {
      this.categoryId = animal.categoryId;
      this.name = animal.name;
      this.sex = animal.sex;
      this.healthStatus = animal.healthStatus;
      this.ageRange = animal.ageRange;
      this.weight = animal.weight;
      this.observations = animal.observations;
      this.image = animal.image;
      this.id = animal.id;
      this.createdAt = animal.created_at.split('T')[0];
    } else {
      this.resetInputs();
    };

    const tabButton = document.getElementById(tab);
    if (tabButton) {
      tabButton.click();
    };
  };

  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file && file instanceof File) {
      this.image = file;
    }
  }

  validations(): string[] {
    let errorMessages: string[] = [];
    const regexName = /^[A-Za-z\s]{3,50}$/;

    if (!this.name.trim() || !regexName.test(this.name.trim())) {
      errorMessages.push("El nombre del animal debe contener solo letras y espacios, y tener al menos 3 caracteres.");
    };

    if (this.weight <= 0) {
      errorMessages.push("El animal debe de tener un peso.");
    };

    if (this.categoryId < 0) {
      errorMessages.push("Por favor, selecciona la especie del animal.");
    };

    if (!this.sex.trim()) {
      errorMessages.push("Por favor, selecciona el sexo del animal.");
    };

    if (!this.ageRange.trim()) {
      errorMessages.push("Por favor, selecciona el rango de edad para el animal.");
    };

    if (!this.healthStatus.trim()) {
      errorMessages.push("Por favor, selecciona el estado de salud del animal.");
    };

    return errorMessages;
  };

  postAnimal(form: NgForm) {
    const errorMessages = this.validations();
    if (errorMessages.length > 0) {
      errorMessages.forEach((message) => {
        this.toastr.error(message);
      });
    } else if (this.id > 0) {
      this.toastr.error("No es posible añadir un animal con características similares.");
    } else {
      this.animalService.postAnimals(this.categoryId, this.name, this.sex, this.healthStatus, this.ageRange, this.weight, this.observations, this.image).subscribe({
        next: (responseCorrect) => {
          this.toastr.success(responseCorrect.message);
          form.resetForm();
          this.resetInputs();
          this.getAnimals();
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

  putAnimal(form: NgForm) {
    const errorMessages = this.validations();
    if (errorMessages.length > 0) {
      errorMessages.forEach((message) => {
        this.toastr.error(message);
      });
    } else if (this.id < 0) {
      this.toastr.error("¡Casi! Primero selecciona el animal que deseas editar.")
    } else {
      this.animalService.putAnimals(this.categoryId, this.name, this.sex, this.healthStatus, this.ageRange, this.weight, this.observations, this.image, this.id).subscribe({
        next: (responseCorrect) => {
          this.toastr.success(responseCorrect.message);
          this.getAnimals();
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

  deleteAnimal(form: NgForm) {
    if (this.id > 0) {
      this.animalService.deleteAnimals(this.id).subscribe({
        next: (responseCorrect) => {
          this.toastr.success(responseCorrect.message);
          form.resetForm();
          this.resetInputs();
          this.getAnimals();
        },
        error: (responseError) => {
          this.toastr.error(responseError.message)
        }
      });
    } else {
      this.toastr.error("¡Casi! Primero selecciona el animal que deseas editar.")
    };
  };

  getAnimals() {
    this.animalService.getAnimals().subscribe({
      next: (responseCorrect) => {
        this.animalsItems = responseCorrect.data;
        this.changeDetector.detectChanges();
      },
      error: (responseError) => {
        this.toastr.error(responseError.error.message);
      }
    });
  };

  getAnimalCategories(): void {
    this.animalService.getAnimalCategories().subscribe({
      next: (responseCorrect) => {
        this.animalCategories = responseCorrect.data;
      },
      error: (responseError) => {
        this.toastr.error(responseError.error.message);
      }
    });
  };
}
