import { ChangeDetectorRef, Component } from '@angular/core';
import { NavComponent } from '../nav-component/nav-component';
import { TaskService } from '../../services/task.service';
import { ToastrService } from 'ngx-toastr';
import { NgClass } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-tasks-component',
  imports: [NavComponent, NgClass, FormsModule],
  templateUrl: './tasks-component.html',
  styleUrl: './tasks-component.css'
})
export class TasksComponent {
  activeLink = "tasks";
  role = sessionStorage.getItem("role");
  currentDate: string = "";
  tasksItems: any[] = [];
  inventoryItems: any[] = [];
  userItems: any[] = [];
  animalItems: any[] = [];
  taskId: number = -1;
  name: string = "";
  deadline: Date = new Date();
  urgency: string = "";
  description: string = "";
  animalnameslist: string = "";
  descriptionR: string = "";
  fileR: File | undefined = undefined;
  userId: number = -1;

  // Agregar tarea
  itemQuantity: number = 0;
  inventoryId: number = -1;
  animalId: number = -1;
  animalsId: number[] = [];

  constructor(private taskService: TaskService, private toastr: ToastrService, private changeDetector: ChangeDetectorRef) { };

  ngOnInit(): void {
    this.getTasks();
    this.getInventory();
    this.getUsers();
    this.getAnimals();

    const today = new Date();
    this.currentDate = today.toISOString().split('T')[0];
  }

  resetInputs() {
    this.taskId = -1;
    this.name = "";
    this.deadline = new Date();
    this.urgency = "";
    this.description = "";
    this.animalnameslist = "";
    this.inventoryId = -1;
    this.itemQuantity = 0;
    this.animalId = -1;
    this.userId = -1;
    this.animalsId = [];
    this.fileR = undefined;
    this.descriptionR = "";
  };

  activateTabItem(tab: string, task: any | null) {
    if (task) {
      this.taskId = task.id;
      this.name = task.name;
      this.deadline = task.deadline;
      this.urgency = task.urgency;
      this.description = task.description;
      this.animalnameslist = task.animalnameslist;
      this.inventoryId = task.inventoryId;
      this.itemQuantity = task.itemQuantity;
      this.userId = task.userId;
      let animals: string[] = task.animalnameslist.split(',');

      this.animalItems.forEach(animal => {
        if (animals.includes(animal.name)) {
          this.animalsId.push(animal.id);
        };
      });
    } else {
      this.resetInputs();
    };

    const tabButton = document.getElementById(tab);
    if (tabButton) {
      tabButton.click();
    }
  };

  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file && file instanceof File) {
      this.fileR = file;
    }
  }

  addAnimal() {
    if (!this.animalsId.includes(this.animalId)) {
      this.animalsId.push(this.animalId);
    };
  };

  removeAnimal(animalId: number) {
    if (this.animalsId.includes(animalId)) {
      this.animalsId.splice(this.animalsId.indexOf(animalId), 1);
    };
  };

  resolveTask(form: NgForm) {
    if (this.descriptionR.length < 10) {
      this.toastr.error("El campo de comentarios debe contener al menos 10 caracteres");
    } else {
      this.taskService.resolveTask(this.descriptionR, this.fileR, this.taskId).subscribe({
        next: (responseCorrect) => {
          this.toastr.success(responseCorrect.message);
          form.resetForm();
          this.resetInputs();
          this.tasksItems = [];
          this.getTasks();
          this.activateTabItem('nav-list-tab', null);
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

  postTask(form: NgForm) {
    if (this.name.trim().length < 5 || this.name.trim().length > 100) {
      this.toastr.error("El nombre de la tarea debe contener al menos 5 caracteres y máximo 100");
    } else if (!this.urgency.trim()) {
      this.toastr.error("La tarea debe contener un nivel de urgencia");
    } else if (!this.deadline) {
      this.toastr.error("La tarea debe contener una fecha límite");
    } else if (this.description.trim().length < 10) {
      this.toastr.error("La descripción de la tarea debe de contener al menos 10 caracteres");
    } else if (this.userId <= 0) {
      this.toastr.error("La tarea debe de tener una persona a cargo");
    } else {
      this.taskService.postTask(this.name, this.urgency, this.deadline, this.description, this.userId, this.inventoryId, this.itemQuantity, this.animalsId).subscribe({
        next: (responseCorrect) => {
          this.toastr.success(responseCorrect.message);
          form.resetForm();
          this.tasksItems = [];
          this.resetInputs();
          this.getTasks();
          this.activateTabItem('nav-list-tab', null);
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

  putTask(form: NgForm) {
    if (this.taskId <= 0) {
      this.toastr.error("¡Casi! Primero selecciona la tarea que deseas actualizar")
    } else if (this.name.trim().length < 5 || this.name.trim().length > 100) {
      this.toastr.error("El nombre de la tarea debe contener al menos 5 caracteres y máximo 100");
    } else if (!this.urgency.trim()) {
      this.toastr.error("La tarea debe contener un nivel de urgencia");
    } else if (!this.deadline) {
      this.toastr.error("La tarea debe contener una fecha límite");
    } else if (this.description.trim().length < 10) {
      this.toastr.error("La descripción de la tarea debe de contener al menos 10 caracteres");
    } else if (this.userId <= 0) {
      this.toastr.error("La tarea debe de tener una persona a cargo");
    } else {
      this.taskService.putTask(this.name, this.urgency, this.deadline, this.description, this.userId, this.inventoryId, this.itemQuantity, this.animalsId, this.taskId).subscribe({
        next: (responseCorrect) => {
          this.toastr.success(responseCorrect.message);
          form.resetForm();
          this.tasksItems = [];
          this.resetInputs();
          this.getTasks();
          this.activateTabItem('nav-list-tab', null);
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

  deleteTask(form: NgForm) {
    if (this.taskId <= 0) {
      this.toastr.error("¡Casi! Primero selecciona la tarea que deseas eliminar")
    } else {
      this.taskService.deleteTask(this.taskId).subscribe({
        next: (responseCorrect) => {
          this.toastr.success(responseCorrect.message);
          form.resetForm();
          this.tasksItems = [];
          this.resetInputs();
          this.getTasks();
          this.activateTabItem('nav-list-tab', null);
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

  reassignTask(form: NgForm) {
    if (this.userId < 0) {
      this.toastr.error('Por favor, selecciona a quién le pasas la tarea');
    } else {
      this.taskService.reassignTask(this.taskId, this.userId).subscribe({
        next: (responseCorrect) => {
          this.toastr.success(responseCorrect.message);
          form.resetForm();
          this.tasksItems = [];
          this.resetInputs();
          this.getTasks();
          this.activateTabItem('nav-list-tab', null);
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

  getTasks() {
    this.taskService.getTask().subscribe({
      next: (responseCorrect) => {
        this.tasksItems = responseCorrect.data;
        this.changeDetector.detectChanges();
      },
      error: (responseError) => {
        this.toastr.error(responseError.error.message);
      }
    });
  };

  getInventory() {
    if (this.role !== "empleado") {
      this.taskService.getInventory().subscribe({
        next: (responseCorrect) => {
          this.inventoryItems = responseCorrect.data;
        },
        error: (responseError) => {
          this.toastr.error(responseError.error.message);
        }
      });
    }
  };

  getUsers() {
    this.taskService.getUsers().subscribe({
      next: (responseCorrect) => {
        this.userItems = responseCorrect.data
      },
      error: (responseError) => {
        this.toastr.error(responseError.error.message);
      }
    });
  };

  getAnimals() {
    this.taskService.getAnimals().subscribe({
      next: (responseCorrect) => {
        this.animalItems = responseCorrect.data;
      },
      error: (responseError) => {
        this.toastr.error(responseError.error.message);
      }
    });
  };

  exportTasks() {
    this.taskService.exportTasks().subscribe({
      next: (responseCorrect: Blob) => {
        const blob = new Blob([responseCorrect], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'tasks_export_' + new Date().getTime() + '.csv';
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (responseError) => {
        this.toastr.error(responseError.error.message)
      }
    });
  };
}
