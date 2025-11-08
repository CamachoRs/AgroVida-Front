import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AnimalService {
  private urlBase = "http://192.168.101.11:8000/api";

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
}
