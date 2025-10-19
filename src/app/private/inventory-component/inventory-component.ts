import { Component, OnInit, ViewChild } from '@angular/core';
import { NavComponent } from "../nav-component/nav-component";
import { ItemComponent } from './item-component/item-component';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InventoryService } from '../../services/inventory.service';
import { Inventory } from '../../models/Inventory.model';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { Category } from '../../models/Category.model';

@Component({
  selector: 'app-inventory-component',
  imports: [NavComponent, ItemComponent, FormsModule, RouterModule, CommonModule],
  templateUrl: './inventory-component.html',
  styleUrl: './inventory-component.css'
})
export class InventoryComponent implements OnInit {
  activeLink = "inventory";
  @ViewChild(ItemComponent) itemComponent!: ItemComponent;
  categories: Category[] = [];
  newItem: Inventory = {
    id: 0,
    nameItem: "",
    quantity: 0,
    unitMeasurement: "",
    entryDate: new Date().toISOString().split("T")[0],
    expiryDate: new Date().toISOString().split("T")[0],
    supplierName: "",
    categoryId: 0,
    category: {
      id: 0,
      nameCategory: "",
      description: ""
    }
  };

  unitMeasurement: string[] = [
    "Litro",
    "Mililitro",
    "Galón",
    "Gramo",
    "Kilogramo",
    "Arroba",
    "Libra",
    "Tonelada",
    "unidades"
  ];

  constructor(private inventoryService: InventoryService, private toastr: ToastrService) { };

  ngOnInit(): void {
    this.getCategory();
  };

  activateTabItem(event: { tab: string, product: Inventory }) {
    const { tab, product } = event;
    product.expiryDate = new Date().toISOString().split("T")[0];
    if (product) {
      this.newItem = { ...product };
    };

    const tabButton = document.getElementById(tab);
    if (tabButton) {
      tabButton.click();
    };
  };

  activateTab(tabId: string) {
    const tabButton = document.getElementById(tabId);
    if (tabButton) {
      tabButton.click();
    };
  };

  validations(): string[] {
    let errorMessages: string[] = [];
    const regexName = /^[A-Za-z\s]{3,50}$/;
    if (this.newItem.category.id && this.newItem.expiryDate && this.newItem.nameItem && this.newItem.quantity && this.newItem.supplierName && this.newItem.unitMeasurement) {
      if (this.newItem.category.id <= 0) {
        errorMessages.push("Por favor, selecciona una categoría.");
      };
      if (!regexName.test(this.newItem.nameItem)) {
        errorMessages.push("El nombre del producto debe contener solo letras y espacios, y tener al menos 3 caracteres.");
      };
      if (this.newItem.quantity < 0) {
        errorMessages.push("El producto debe tener al menos una cantidad.");
      };
      if (!regexName.test(this.newItem.supplierName)) {
        errorMessages.push("El nombre del proveedor debe contener solo letras y espacios, y tener al menos 3 caracteres.");
      };
      if (this.newItem.unitMeasurement == "") {
        errorMessages.push("Por favor, selecciona un tipo de unidad.");
      };
    } else {
      errorMessages.push("Por favor, completa todos los campos.");
    };

    return errorMessages;
  };

  postInventory(form: NgForm) {
    const errorMessages = this.validations();
    if (errorMessages.length > 0) {
      errorMessages.forEach((message) => {
        this.toastr.error(message);
      });
    } else {
      this.newItem.categoryId = this.newItem.category.id
      this.inventoryService.postInventory(this.newItem).subscribe({
        next: (responseCorrect) => {
          this.toastr.success(responseCorrect.message);
          form.resetForm();
          this.activateTab('nav-list-tab');
          this.itemComponent.listInventory();
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

  setInventory(form: NgForm) {
    const errorMessages = this.validations();
    if (errorMessages.length > 0) {
      errorMessages.forEach((message) => {
        this.toastr.error(message);
      });
    } else {
      this.inventoryService.setInventory(this.newItem, this.newItem.id).subscribe({
        next: (responseCorrect) => {
          this.toastr.success(responseCorrect.message);
          form.resetForm();
          this.activateTab('nav-list-tab');
          this.itemComponent.listInventory();
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
  };

  deleteInventory(form: NgForm) {
    this.inventoryService.deleteInventory(this.newItem.id).subscribe({
      next: (responseCorrect) => {
        this.toastr.success(responseCorrect.message);
        form.resetForm();
        this.activateTab('nav-list-tab');
        this.itemComponent.listInventory();
      },
      error: (responseError) => {
        this.toastr.error(responseError.message)
      }
    });
  };

  getCategory() {
    this.inventoryService.getCategory().subscribe({
      next: (responseCorrect) => {
        for (let category of responseCorrect.data) {
          this.categories.push({
            id: category.id,
            nameCategory: category.nameCategory,
            description: category.description
          });
        };
      },
      error: (responseError) => {
        this.toastr.error(responseError.error)
      }
    });
  };
}
