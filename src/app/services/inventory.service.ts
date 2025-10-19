import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Inventory } from '../models/inventory.model';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private urlBase = "http://192.168.101.6:8000/api";

  constructor(private http: HttpClient) { };

  getInventory() {
    return this.http.get<any>(`${this.urlBase}/inventory`);
  };

  postInventory(inventory: Inventory) {
    const data = { inventory };
    return this.http.post<any>(`${this.urlBase}/inventory`, data);
  };

  setInventory(inventory: Inventory, id: number = 0) {
    const data = { inventory };
    return this.http.put<any>(`${this.urlBase}/inventory/${id}`, data);
  }

  deleteInventory(id: number = 0) {
    return this.http.delete<any>(`${this.urlBase}/inventory/${id}`);
  }

  getCategory() {
    return this.http.get<any>(`${this.urlBase}/category`);
  };
}
