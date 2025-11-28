import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private urlBase = "http://192.168.101.9:8000/api";

  constructor(private http: HttpClient) { };

  getProductCategory() {
    return this.http.get<any>(`${this.urlBase}/categoryProduct`);
  };

  postProductCategory(nameProduct: string, descriptionProduct: string) {
    const data = {
      product: {
        name: nameProduct.trim(),
        description: descriptionProduct.trim() ? descriptionProduct.trim() : null
      }
    };

    return this.http.post<any>(`${this.urlBase}/categoryProduct`, data);
  };

  putProductCategory(nameProduct: string, descriptionProduct: string, id: number) {
    const data = {
      product: {
        name: nameProduct.trim(),
        description: descriptionProduct.trim() ? descriptionProduct.trim() : null
      }
    };

    return this.http.put<any>(`${this.urlBase}/categoryProduct/${id}`, data);
  };

  deleteProductCategory(id: number) {
    return this.http.delete<any>(`${this.urlBase}/categoryProduct/${id}`);
  };

  getAnimalCategory() {
    return this.http.get<any>(`${this.urlBase}/categoryAnimal`);
  };

  postAnimalCategory(nameAnimal: string, descriptionAnimal: string) {
    const data = {
      animal: {
        name: nameAnimal.trim(),
        description: descriptionAnimal.trim() ? descriptionAnimal.trim() : null
      }
    };

    return this.http.post<any>(`${this.urlBase}/categoryAnimal`, data);
  };

  putAnimalCategory(nameAnimal: string, descriptionAnimal: string, id: number) {
    const data = {
      animal: {
        name: nameAnimal.trim(),
        description: descriptionAnimal.trim() ? descriptionAnimal.trim() : null
      }
    };

    return this.http.put<any>(`${this.urlBase}/categoryAnimal/${id}`, data);
  };

  deleteAnimalCategory(id: number) {
    return this.http.delete<any>(`${this.urlBase}/categoryAnimal/${id}`);
  };
}
