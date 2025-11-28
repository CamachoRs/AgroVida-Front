import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NavComponent } from "../nav-component/nav-component";
import { NewsService } from '../../services/news.service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-news-component',
  imports: [NavComponent, FormsModule, CommonModule],
  templateUrl: './news-component.html',
  styleUrl: './news-component.css'
})
export class NewsComponent implements OnInit {
  activeLink = "news";
  role = sessionStorage.getItem("role");
  titleModal: string | null = null;
  newsId: number = -1;
  newsTitle: string = "";
  newsDescription: string = "";
  newsNameUser: string = "";
  newsUpdate: string = "";
  newsImage: string = "";
  fileImage: File | null = null;
  selectAnimals: string = "";
  newsAnimals: string[] = [];
  newsItems: any[] = [];
  newsAnimalCategories: any[] = [];

  constructor(private newService: NewsService, private toastr: ToastrService, private changeDetector: ChangeDetectorRef) { };

  ngOnInit(): void {
    this.getNews();
    this.getAnimalCategories();
  }

  resetInputs(): void {
    this.newsId = -1;
    this.newsTitle = "";
    this.newsDescription = "";
    this.newsNameUser = "";
    this.newsUpdate = "";
    this.newsImage = "";
    this.fileImage = null;
    this.selectAnimals = "";
    this.newsAnimals = [];
  };

  activateTabItem(tab: string, news: any | null, titleModal: string | null) {
    if (news) {
      this.newsId = news.id;
      this.newsTitle = news.title;
      this.newsDescription = news.description;
      this.newsNameUser = news.nameUser;
      this.newsUpdate = news.updated_at;
      this.newsImage = news.image;
      this.newsAnimals = news.animals.split(', ');
    } else {
      this.resetInputs();
    };

    const tabButton = document.getElementById(tab);
    if (tabButton) {
      tabButton.click();
      this.titleModal = titleModal;
    };
  };

  addAnimal() {
    if (!this.newsAnimals.includes(this.selectAnimals)) {
      this.newsAnimals.push(this.selectAnimals);
    }
  };

  removeAnimal(animal: string) {
    if (this.newsAnimals.includes(animal)) {
      this.newsAnimals.splice(this.newsAnimals.indexOf(animal), 1);
    };
  };

  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file && file instanceof File) {
      this.fileImage = file;
    }
  }

  validations(): string[] {
    let errorMessages: string[] = [];
    const regexName = /^[A-Za-z\s]{5,50}$/;

    if (!this.newsTitle.trim() || !regexName.test(this.newsTitle.trim())) {
      errorMessages.push("El titulo de la novedad debe contener solo letras y espacios, y tener al menos 5 caracteres.");
    };

    if (this.newsDescription.trim().length < 10) {
      errorMessages.push("La descripción de la novedad debe contener al menos 10 caracteres.");
    };

    if (this.newsAnimals.length <= 0) {
      errorMessages.push("La novedad debe tener al menos un animal.");
    };

    return errorMessages;
  };

  postNews(form: NgForm): void {
    const errorMessages = this.validations();
    if (errorMessages.length > 0) {
      errorMessages.forEach((message) => {
        this.toastr.error(message);
      });
    } else {
      this.newService.postNews(this.newsTitle, this.newsDescription, this.newsAnimals, this.fileImage).subscribe({
        next: (responseCorrect) => {
          this.toastr.success(responseCorrect.message);
          form.resetForm();
          this.resetInputs();
          this.getNews();
          this.activateTabItem('closeExampleModal2', null, null);
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

  putNews(form: NgForm): void {
    const errorMessages = this.validations();
    if (errorMessages.length > 0) {
      errorMessages.forEach((message) => {
        this.toastr.error(message);
      });
    } else {
      this.newService.putNews(this.newsTitle, this.newsDescription, this.newsAnimals, this.fileImage, this.newsId).subscribe({
        next: (responseCorrect) => {
          this.toastr.success(responseCorrect.message);
          form.resetForm();
          this.resetInputs();
          this.getNews();
          this.activateTabItem('closeExampleModal2', null, null);
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

  deleteNews(id: number): void {
    if (id > 0) {
      this.newService.deleteNews(id).subscribe({
        next: (responseCorrect) => {
          this.toastr.success(responseCorrect.message);
          this.getNews();
        },
        error: (responseError) => {
          if (responseError && responseError.error && responseError.error.message) {
            this.toastr.error(responseError.error.message);
          } else if (responseError && responseError.message) {
            this.toastr.error(responseError.message);
          } else {
            this.toastr.error("Hubo un error eliminar la novedad.");
          };
        }
      });
    } else {
      this.toastr.error("¡Casi! Primero selecciona la novedad que deseas eliminar de la tabla.")
    };
  };

  getNews(): void {
    this.newService.getNews().subscribe({
      next: (responseCorrect) => {
        this.newsItems = responseCorrect.data;
        this.changeDetector.detectChanges();
      },
      error: (responseError) => {
        this.toastr.error(responseError.error.message);
      }
    });
  };

  getAnimalCategories(): void {
    this.newService.getAnimalCategories().subscribe({
      next: (responseCorrect) => {
        this.newsAnimalCategories = responseCorrect.data;
      },
      error: (responseError) => {
        this.toastr.error(responseError.error.message);
      }
    });
  };
}
