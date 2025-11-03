import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private urlBase = "http://192.168.101.11:8000/api";

  constructor(private http: HttpClient) { };

  getInventory() {
    return this.http.get<any>(`${this.urlBase}/inventory`);
  };

  postInventory(inventoryNameItem: string, inventoryQuantity: number, inventoryUnitMeasurement: string, inventoryExpiryDate: string, inventorySupplierName: string, inventoryCategoryId: number) {
    const data = {
      inventory: {
        nameItem: inventoryNameItem.trim(),
        quantity: inventoryQuantity,
        unitMeasurement: inventoryUnitMeasurement.trim(),
        expiryDate: inventoryExpiryDate.trim(),
        supplierName: inventorySupplierName.trim(),
        categoryId: inventoryCategoryId
      }
    };
    return this.http.post<any>(`${this.urlBase}/inventory`, data);
  };

  putInventory(inventoryNameItem: string, inventoryQuantity: number, inventoryUnitMeasurement: string, inventoryExpiryDate: string, inventorySupplierName: string, inventoryCategoryId: number, id: number) {
    const data = {
      inventory: {
        nameItem: inventoryNameItem.trim(),
        quantity: inventoryQuantity,
        unitMeasurement: inventoryUnitMeasurement.trim(),
        expiryDate: inventoryExpiryDate.trim(),
        supplierName: inventorySupplierName.trim(),
        categoryId: inventoryCategoryId
      }
    };
    return this.http.put<any>(`${this.urlBase}/inventory/${id}`, data);
  }

  deleteInventory(id: number) {
    return this.http.delete<any>(`${this.urlBase}/inventory/${id}`);
  }

  getCategory() {
    return this.http.get<any>(`${this.urlBase}/categoryProduct`);
  };
}
