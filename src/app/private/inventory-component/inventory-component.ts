import { Component } from '@angular/core';
import { NavComponent } from "../nav-component/nav-component";
import { ItemComponent } from './item-component/item-component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-inventory-component',
  imports: [NavComponent, ItemComponent, FormsModule, RouterModule],
  templateUrl: './inventory-component.html',
  styleUrl: './inventory-component.css'
})
export class InventoryComponent {
  activeLink = "inventory";
  currentDate: string = "";
  unitMeasurement: string[] = [
    "Litro",
    "Mililitro",
    "Galón",
    "Gramo",
    "Kilogramo",
    "Arroba",
    "Libra",
    "Tonelada",
    "Unidad"
  ];

  constructor() {
    const today = new Date();
    this.currentDate = today.toISOString().split("T")[0];
  };

  activateTab(tabId: string) {
    const tabButton = document.getElementById(tabId);
    if (tabButton) {
      tabButton.click();
    };
  };
}
