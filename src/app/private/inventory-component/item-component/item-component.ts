import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-item-component',
  imports: [],
  templateUrl: './item-component.html',
  styleUrl: './item-component.css'
})
export class ItemComponent {
  @Output()
  changeTab = new EventEmitter<string>();

  requestChange(newTab: string) {
    this.changeTab.emit(newTab);
  };
}
