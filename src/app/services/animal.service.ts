import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnimalService {
  private urlBase = "http://192.168.101.5:8000/api";

  constructor(private http: HttpClient) { };

  getAnimals() {
    return this.http.get<any>(`${this.urlBase}/animals`);
  };

  postAnimals(categoryId: number, name: string, sex: string, healthStatus: string, ageRange: string, weight: number, observations: string | undefined, image: File | undefined) {
    const formData: FormData = new FormData();
    formData.append("animal[categoryId]", categoryId.toString().trim());
    formData.append("animal[name]", name.trim());
    formData.append("animal[sex]", sex.trim());
    formData.append("animal[healthStatus]", healthStatus.trim());
    formData.append("animal[ageRange]", ageRange.trim());
    formData.append("animal[weight]", weight.toString().trim());
    if (observations) {
      formData.append("animal[observations]", observations.trim());
    };
    if (image) {
      formData.append("animal[image]", image);
    };

    return this.http.post<any>(`${this.urlBase}/animals`, formData);
  };

  putAnimals(categoryId: number, name: string, sex: string, healthStatus: string, ageRange: string, weight: number, observations: string | undefined, image: File | undefined, id: number) {
    const formData: FormData = new FormData();
    formData.append("animal[categoryId]", categoryId.toString().trim());
    formData.append("animal[name]", name.trim());
    formData.append("animal[sex]", sex.trim());
    formData.append("animal[healthStatus]", healthStatus.trim());
    formData.append("animal[ageRange]", ageRange.trim());
    formData.append("animal[weight]", weight.toString().trim());

    if (observations) {
      formData.append("animal[observations]", observations.trim());
    };
    if (image instanceof File) {
      formData.append("animal[image]", image);
    };

    return this.http.post<any>(`${this.urlBase}/animals/${id}`, formData);
  };

  deleteAnimals(id: number) {
    return this.http.delete<any>(`${this.urlBase}/animals/${id}`);;
  };

  getAnimalCategories() {
    return this.http.get<any>(`${this.urlBase}/categoryAnimal`);
  };

  getMedical(id: number) {
    return this.http.get<any>(`${this.urlBase}/medical/${id}`)
  };

  postMedical(animalId: number, reviewType: string, observations: string | undefined, reviewerName: string, medicationName: string | undefined, dose: string | undefined, administrationRoute: string | undefined, file: File | undefined) {
    const formData: FormData = new FormData();
    formData.append("medical[animalId]", animalId.toString().trim());
    formData.append("medical[reviewType]", reviewType.trim());
    formData.append("medical[reviewerName]", reviewerName.trim());

    if (observations) {
      formData.append("medical[observations]", observations.trim());
    };
    if (medicationName) {
      formData.append("medical[medicationName]", medicationName.trim());
    };
    if (dose) {
      formData.append("medical[dose]", dose.trim());
    };
    if (administrationRoute) {
      formData.append("medical[administrationRoute]", administrationRoute.trim());
    };
    if (file) {
      formData.append("medical[file]", file, file.name);
    };
    return this.http.post<any>(`${this.urlBase}/medical`, formData);
  };

  putMedical(animalId: number, reviewType: string, observations: string | undefined, reviewerName: string, medicationName: string | undefined, dose: string | undefined, administrationRoute: string | undefined, file: File | undefined, id: number) {
    const formData: FormData = new FormData();
    formData.append("medical[animalId]", animalId.toString().trim());
    formData.append("medical[reviewType]", reviewType.trim());
    formData.append("medical[reviewerName]", reviewerName.trim());

    if (observations) {
      formData.append("medical[observations]", observations.trim());
    };
    if (medicationName) {
      formData.append("medical[medicationName]", medicationName.trim());
    };
    if (dose) {
      formData.append("medical[dose]", dose.trim());
    };
    if (administrationRoute) {
      formData.append("medical[administrationRoute]", administrationRoute.trim());
    };
    if (file instanceof File) {
      formData.append("medical[file]", file, file.name);
    };

    return this.http.post<any>(`${this.urlBase}/medical/${id}`, formData)
  };

  downloadMedicalFile(id: number): Observable<Blob> {
    return this.http.get(`${this.urlBase}/medical-reviews/${id}/download`, {
      responseType: 'blob'
    });
  }
}
