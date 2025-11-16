import { ChangeDetectorRef, Component } from '@angular/core';
import { NavComponent } from "../nav-component/nav-component";
import { AnimalService } from '../../services/animal.service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-animals-component',
  imports: [NavComponent, FormsModule, CommonModule],
  templateUrl: './animals-component.html',
  styleUrl: './animals-component.css'
})
export class AnimalsComponent {
  activeLink = "animals";
  titleModal = "Detalle de la revisión";
  animalsItems: any[] = [];
  animalCategories: any[] = []
  medicalInformation: any[] = []
  categoryId: number = -1;
  animalId: number = -1;
  name: string = "";
  sex: string = "";
  healthStatus: string = "";
  ageRange: string = "";
  weight: number = 0;
  observations: string | undefined = undefined;
  image: File | undefined = undefined;
  id: number = -1;
  createdAt: string = "";
  medicalId: number = -1;
  reviewType: string = "";
  observationsMedical: string | undefined = undefined
  reviewerName: string = "";
  medicationName: string | undefined = undefined;
  dose: string | undefined = undefined;
  administrationRoute: string | undefined = undefined;
  file: File | undefined = undefined;

  constructor(private animalService: AnimalService, private toastr: ToastrService, private changeDetector: ChangeDetectorRef) { };

  ngOnInit(): void {
    const today = new Date();
    this.createdAt = today.toISOString().split('T')[0];
    this.getAnimals();
    this.getAnimalCategories();
  };

  resetInputs(): void {
    this.categoryId = -1;
    this.animalId = -1;
    this.name = "";
    this.sex = "";
    this.healthStatus = "";
    this.ageRange = "";
    this.weight = 0;
    this.observations = undefined;
    this.image = undefined;
    this.id = -1;
    this.createdAt = "";
    this.medicalId = -1;
    this.reviewType = "";
    this.observationsMedical = undefined;
    this.reviewerName = "";
    this.medicationName = undefined;
    this.dose = undefined;
    this.administrationRoute = undefined;
    this.file = undefined;
  };

  activateTabItem(tab: string, animal: any | null, medical: any | null, title: string | null) {
    this.activeModal(title);
    if (animal) {
      this.categoryId = animal.categoryId;
      this.animalId = animal.id
      this.name = animal.name;
      this.sex = animal.sex;
      this.healthStatus = animal.healthStatus;
      this.ageRange = animal.ageRange;
      this.weight = animal.weight;
      this.observations = animal.observations;
      this.image = animal.image;
      this.id = animal.id;
      this.createdAt = animal.created_at.split('T')[0];
      this.getMedical();
    } else if (medical) {
      this.medicalId = medical.id;
      this.reviewType = medical.reviewType;
      this.observationsMedical = medical.observations;
      this.reviewerName = medical.reviewerName;
      this.medicationName = medical.medicationName;
      this.dose = medical.dose;
      this.administrationRoute = medical.administrationRoute ?? undefined;
      this.file = medical.file;
    } else if (tab != "nav-review-tab") {
      this.resetInputs();
      this.medicalInformation = [];
    };

    const tabButton = document.getElementById(tab);
    if (tabButton) {
      tabButton.click();
    };
  };

  activeModal(title: string | null) {
    if (title) {
      this.titleModal = title;
      this.medicalId = -1;
      this.reviewType = "";
      this.observationsMedical = undefined;
      this.reviewerName = "";
      this.medicationName = undefined;
      this.dose = undefined;
      this.administrationRoute = undefined;
      this.file = undefined;
    }
  };

  onImageSelected(event: any, campo: string): void {
    const file = event.target.files[0];
    if (campo === "image") {
      if (file && file instanceof File) {
        this.image = file;
      }
    } else {
      if (file && file instanceof File) {
        this.file = file;
      }
    };
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
          this.activateTabItem('nav-list-tab', null, null, null)
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

  postMedical(form: NgForm) {
    const regexName = /^[A-Za-z\s]{3,50}$/;
    let validation = true;
    if (!this.reviewType.trim()) {
      this.toastr.error("Por favor, selecciona el tipo de revisión");
      validation = false;
    };
    if (!this.reviewerName.trim() || !regexName.test(this.reviewerName.trim())) {
      this.toastr.error("El nombre de la persona debe contener solo letras y espacios, y tener al menos 3 caracteres.");
      validation = false;
    };
    if (this.animalId > 0 && validation) {
      this.animalService.postMedical(this.animalId, this.reviewType, this.observationsMedical, this.reviewerName, this.medicationName, this.dose, this.administrationRoute, this.file).subscribe({
        next: (responseCorrect) => {
          this.toastr.success(responseCorrect.message);
          form.resetForm();
          this.getMedical();
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

  putMedical(form: NgForm) {
    const regexName = /^[A-Za-z\s]{3,50}$/;
    let validation = true;
    console.log(this.animalId);

    if (!regexName.test(this.reviewerName.trim())) {
      this.toastr.error("El nombre de la persona debe contener solo letras y espacios, y tener al menos 3 caracteres.");
      validation = false;
    };
    if (this.animalId > 0 && validation) {
      this.animalService.putMedical(this.animalId, this.reviewType, this.observationsMedical, this.reviewerName, this.medicationName, this.dose, this.administrationRoute, this.file, this.medicalId).subscribe({
        next: (responseCorrect) => {
          this.toastr.success(responseCorrect.message);
          this.getMedical();
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
    }
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

  getAnimalCategories() {
    this.animalService.getAnimalCategories().subscribe({
      next: (responseCorrect) => {
        this.animalCategories = responseCorrect.data;
      },
      error: (responseError) => {
        this.toastr.error(responseError.error.message);
      }
    });
  };

  getMedical() {
    this.animalService.getMedical(this.animalId).subscribe({
      next: (responseCorrect) => {
        this.medicalInformation = responseCorrect.data;
        this.changeDetector.detectChanges();
      },
      error: (responseError) => {
        this.toastr.error(responseError.error.message);
      }
    });
  };

  downloadMedicalFile(medicalId: number): void {
    this.animalService.downloadMedicalFile(medicalId).subscribe({
      next: (response: Blob) => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(response);
        link.download = `medical-review-${medicalId}`;
        link.click();
      },
      error: (error) => {
        this.toastr.error("Error al descargar el archivo.");
      }
    });
  }

}
