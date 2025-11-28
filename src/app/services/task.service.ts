import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private urlBase = "http://192.168.101.9:8000/api";

  constructor(private http: HttpClient) { };

  getTask() {
    return this.http.get<any>(`${this.urlBase}/tasks`);
  };

  postTask(name: string, urgency: string, deadline: Date, description: string, userId: number, inventoryId: number, itemQuantity: number, animalIds: number[]) {
    const data = {
      task: {
        "name": name.trim(),
        "urgency": urgency.trim(),
        "deadline": deadline,
        "description": description.trim(),
        "userId": userId,
        "inventoryId": inventoryId <= 0 ? undefined : inventoryId,
        "itemQuantity": itemQuantity <= 0 ? undefined : itemQuantity,
        "animalIds": animalIds.length <= 0 ? undefined : animalIds
      }
    };

    return this.http.post<any>(`${this.urlBase}/tasks`, data);
  };

  putTask(name: string, urgency: string, deadline: Date, description: string, userId: number, inventoryId: number, itemQuantity: number, animalIds: number[], id: number) {
    const data = {
      task: {
        "name": name.trim(),
        "urgency": urgency.trim(),
        "deadline": deadline,
        "description": description.trim(),
        "userId": userId,
        "inventoryId": inventoryId <= 0 ? undefined : inventoryId,
        "itemQuantity": itemQuantity <= 0 ? undefined : itemQuantity,
        "animalIds": animalIds.length <= 0 ? undefined : animalIds
      }
    };

    return this.http.put<any>(`${this.urlBase}/tasks/${id}`, data);
  };

  deleteTask(id: number) {
    return this.http.delete<any>(`${this.urlBase}/tasks/${id}`);
  };

  resolveTask(description: string | undefined, file: File | undefined, id: number) {
    const formData: FormData = new FormData();
    const resolvedAt = new Date();
    formData.append("task[resolvedAt]", resolvedAt.toISOString());

    if (description) {
      formData.append("task[descriptionR]", description.trim());
    };

    if (file) {
      formData.append("task[imageR]", file, file.name);
    };

    return this.http.post<any>(`${this.urlBase}/tasks/${id}`, formData);
  };

  reassignTask(id: number, idUser: number) {
    const data = { task: { userId: idUser } };
    return this.http.put<any>(`${this.urlBase}/tasks/${id}`, data);
  };

  getInventory() {
    return this.http.get<any>(`${this.urlBase}/inventory`);
  };

  getUsers() {
    return this.http.get<any>(`${this.urlBase}/users`);
  };

  getAnimals() {
    return this.http.get<any>(`${this.urlBase}/animals`);
  };

  exportTasks() {
    return this.http.get(`${this.urlBase}/tasks/export`, { responseType: 'blob' })
  }
}
