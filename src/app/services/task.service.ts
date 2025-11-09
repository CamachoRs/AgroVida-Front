import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private urlBase = "http://192.168.101.11:8000/api";

  constructor(private http: HttpClient) { };

  getTask() {
    return this.http.get<any>(`${this.urlBase}/tasks`);
  };

  postTask(name: string, urgency: string, deadline: Date, description: string, userId: number, inventoryId: number | undefined, itemQuantity: number | undefined, animalIds: number[] | undefined) {
    const data = {
      "name": name.trim(),
      "urgency": urgency.trim(),
      "deadline": deadline,
      "description": description.trim(),
      "userId": userId,
      "inventoryId": inventoryId ?? undefined,
      "itemQuantity": itemQuantity ?? undefined,
      "animalIds": animalIds ?? undefined
    };

    return this.http.post<any>(`${this.urlBase}/tasks`, data);
  };

  putTask(name: string, urgency: string, deadline: Date, description: string, userId: number, inventoryId: number | undefined, itemQuantity: number | undefined, animalIds: number[] | undefined, id: number) {
    const data = {
      "name": name.trim(),
      "urgency": urgency.trim(),
      "deadline": deadline,
      "description": description.trim(),
      "userId": userId,
      "inventoryId": inventoryId ?? undefined,
      "itemQuantity": itemQuantity ?? undefined,
      "animalIds": animalIds ?? undefined
    };

    return this.http.put<any>(`${this.urlBase}/tasks/${id}`, data);
  };

  deleteTask(id: number) {
    return this.http.delete<any>(`${this.urlBase}/tasks/${id}`);
  };

  resolveTask(description: string | undefined, file: File | undefined, resolvedAt: Date, id: number) {
    const formData: FormData = new FormData();
    formData.append("task[resolvedAt]", resolvedAt.toString());

    if (description) {
      formData.append("task[descriptionR]", description.trim());
    };

    if (file) {
      formData.append("task[fileR]", file, file.name);
    };

    return this.http.post<any>(`${this.urlBase}/tasks/${id}`, formData);
  };
}
