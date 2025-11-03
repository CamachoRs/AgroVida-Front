import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwIfEmpty } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private urlBase = "http://192.168.101.11:8000/api"

  constructor(private http: HttpClient) { };

  getNews() {
    return this.http.get<any>(`${this.urlBase}/news`);
  };

  getAnimalCategories() {
    return this.http.get<any>(`${this.urlBase}/categoryAnimal`);
  };

  postNews(title: string, description: string, categoryAnimal: string[], image: File | null) {
    const formData: FormData = new FormData();
    formData.append("new[title]", title.trim());
    formData.append("new[description]", description.trim());
    formData.append("new[categoryAnimal]", categoryAnimal.join(",").trim());
    if (image) {
      formData.append("new[image]", image, image.name);
    };

    return this.http.post<any>(`${this.urlBase}/news`, formData);
  };

  putNews(title: string, description: string, categoryAnimal: string[], image: File | null, id: number) {
    const formData: FormData = new FormData();
    formData.append("new[title]", title.trim());
    formData.append("new[description]", description.trim());
    formData.append("new[categoryAnimal]", categoryAnimal.join(",").trim());
    if (image) {
      formData.append("new[image]", image, image.name);
    };

    return this.http.post<any>(`${this.urlBase}/news/${id}`, formData);
  };

  deleteNews(id: number) {
    return this.http.delete<any>(`${this.urlBase}/news/${id}`);
  };
}
