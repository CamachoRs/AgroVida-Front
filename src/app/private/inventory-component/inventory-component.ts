import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NavComponent } from "../nav-component/nav-component";
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InventoryService } from '../../services/inventory.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inventory-component',
  imports: [NavComponent, FormsModule, RouterModule, CommonModule],
  templateUrl: './inventory-component.html',
  styleUrl: './inventory-component.css'
})
export class InventoryComponent implements OnInit {
  activeLink = "inventory";
  inventoryId: number = -1;
  inventoryNameItem: string = "";
  inventoryQuantity: number = 0;
  inventoryUnitMeasurement: string = "";
  inventoryExpiryDate: string = "";
  inventorySupplierName: string = "";
  inventoryCategoryId: number = 0;
  currentDate: string = "";
  categories: any[] = [];
  inventoryItems: any[] = [];
  unitMeasurement: string[] = [
    "litro",
    "mililitro",
    "galón",
    "gramo",
    "kilogramo",
    "arroba",
    "libra",
    "tonelada",
    "unidades"
  ];

  constructor(private inventoryService: InventoryService, private toastr: ToastrService, private changeDetector: ChangeDetectorRef) { };

  ngOnInit(): void {
    this.getCategory();
    this.listInventory();

    const today = new Date();
    this.currentDate = today.toISOString().split('T')[0];
  };

  resetInputs(): void {
    this.inventoryId = -1;
    this.inventoryNameItem = "";
    this.inventoryQuantity = 0;
    this.inventoryUnitMeasurement = "";
    this.inventoryExpiryDate = "";
    this.inventorySupplierName = "";
    this.inventoryCategoryId = 0;
  };

  activateTabItem(tab: string, product: any | null) {
    if (product) {
      this.inventoryId = product.id
      this.inventoryNameItem = product.nameItem;
      this.inventoryQuantity = product.quantity;
      this.inventoryCategoryId = product.categoryId;
      this.inventoryExpiryDate = product.expiryDate.split(" ")[0].trim();
      this.inventoryUnitMeasurement = product.unitMeasurement;
      this.inventorySupplierName = product.supplierName;
    } else {
      this.resetInputs();
    };

    const tabButton = document.getElementById(tab);
    if (tabButton) {
      tabButton.click();
    };
  };

  validations(): string[] {
    let errorMessages: string[] = [];
    const regexName = /^[A-Za-z\s]{3,50}$/;

    if (!this.inventoryNameItem.trim() || !regexName.test(this.inventoryNameItem.trim())) {
      errorMessages.push("El nombre del producto debe contener solo letras y espacios, y tener al menos 3 caracteres.");
    };

    if (this.inventoryQuantity < 0) {
      errorMessages.push("El producto debe tener al menos una cantidad.");
    };

    if (this.inventoryCategoryId < 0) {
      errorMessages.push("Por favor, selecciona una categoría.");
    };

    if (!this.inventoryExpiryDate.trim()) {
      errorMessages.push("Por favor, selecciona una fecha de expiración.");
    };

    if (!this.inventoryUnitMeasurement.trim()) {
      errorMessages.push("Por favor, selecciona un tipo de unidad.");
    };

    if (!this.inventorySupplierName.trim() || !regexName.test(this.inventorySupplierName.trim())) {
      errorMessages.push("El nombre del proveedor debe contener solo letras y espacios, y tener al menos 3 caracteres.");
    };

    return errorMessages;
  };

  postInventory(form: NgForm) {
    const errorMessages = this.validations();
    if (errorMessages.length > 0) {
      errorMessages.forEach((message) => {
        this.toastr.error(message);
      });
    } else if (this.inventoryId > 0) {
      this.toastr.error("No es posible añadir un producto con características similares");
    } else {
      this.inventoryService.postInventory(this.inventoryNameItem, this.inventoryQuantity, this.inventoryUnitMeasurement, this.inventoryExpiryDate, this.inventorySupplierName, this.inventoryCategoryId).subscribe({
        next: (responseCorrect) => {
          this.toastr.success(responseCorrect.message);
          form.resetForm();
          this.resetInputs();
          this.activateTabItem('nav-list-tab', null);
          this.listInventory();
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

  putInventory(form: NgForm) {
    if (this.inventoryId > 0) {
      const errorMessages = this.validations();
      if (errorMessages.length > 0) {
        errorMessages.forEach((message) => {
          this.toastr.error(message);
        });
      } else {
        this.inventoryService.putInventory(this.inventoryNameItem, this.inventoryQuantity, this.inventoryUnitMeasurement, this.inventoryExpiryDate, this.inventorySupplierName, this.inventoryCategoryId, this.inventoryId).subscribe({
          next: (responseCorrect) => {
            this.toastr.success(responseCorrect.message);
            form.resetForm();
            this.resetInputs();
            this.activateTabItem('nav-list-tab', null);
            this.listInventory();
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
      }
    } else {
      this.toastr.error("¡Casi! Primero selecciona el producto que deseas eliminar de la tabla.")
    };
  };

  deleteInventory(form: NgForm) {
    if (this.inventoryId > 0) {
      this.inventoryService.deleteInventory(this.inventoryId).subscribe({
        next: (responseCorrect) => {
          this.toastr.success(responseCorrect.message);
          form.resetForm();
          this.resetInputs();
          this.activateTabItem('nav-list-tab', null);
          this.listInventory();
        },
        error: (responseError) => {
          this.toastr.error(responseError.message)
        }
      });
    } else {
      this.toastr.error("¡Casi! Primero selecciona el producto que deseas eliminar de la tabla.")
    };
  };

  getCategory() {
    this.inventoryService.getCategory().subscribe({
      next: (responseCorrect) => {
        for (let category of responseCorrect.data) {
          this.categories.push({
            id: category.id,
            nameCategory: category.name
          });
        };
      },
      error: (responseError) => {
        this.toastr.error(responseError.error.message)
      }
    });
  };

  listInventory() {
    this.inventoryService.getInventory().subscribe({
      next: (responseCorrect) => {
        this.inventoryItems = responseCorrect.data;
        this.changeDetector.detectChanges();
      },
      error: (responseError) => {
        this.toastr.error(responseError.error.message);
      }
    });
  };
}
