import { Component } from '@angular/core';
import { NavComponent } from '../nav-component/nav-component';
import { ItemComponent } from './item-component/item-component';

@Component({
  selector: 'app-tasks-component',
  imports: [NavComponent, ItemComponent],
  templateUrl: './tasks-component.html',
  styleUrl: './tasks-component.css'
})
export class TasksComponent {
  activeLink = "tasks";

  activateTab(tabId: string) {
    const tabButton = document.getElementById(tabId);
    if (tabButton) {
      tabButton.click();
    };
  };
}
