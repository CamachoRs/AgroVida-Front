import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { InventoryService } from '../../../services/inventory.service';
import { ToastrService } from 'ngx-toastr';
import { Inventory } from '../../../models/Inventory.model';
import { CommonModule } from '@angular/common';
import { Category } from '../../../models/Category.model';

@Component({
  selector: 'app-item-component',
  imports: [CommonModule],
  templateUrl: './item-component.html',
  styleUrl: './item-component.css'
})
export class ItemComponent implements OnInit {
  @Output()
  changeTab = new EventEmitter<{ tab: string, product: Inventory }>();
  inventoryItems: Inventory[] = [];

  constructor(private inventoryService: InventoryService, private toastr: ToastrService, private changeDetector: ChangeDetectorRef) { };

  ngOnInit(): void {
    this.listInventory();
  };

  requestChange(newTab: string, item: Inventory) {
    this.changeTab.emit({ tab: newTab, product: item });
  }

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
