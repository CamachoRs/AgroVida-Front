import { ChangeDetectorRef, Component } from '@angular/core';
import { NavComponent } from '../nav-component/nav-component';
import { TaskService } from '../../services/task.service';
import { ToastrService } from 'ngx-toastr';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tasks-component',
  imports: [NavComponent, NgClass, FormsModule],
  templateUrl: './tasks-component.html',
  styleUrl: './tasks-component.css'
})
export class TasksComponent {
  activeLink = "tasks";
  tasksItems: any[] = [];
  // Para marcar una tarea como completada
  name: string = "";
  deadline: Date = new Date();
  urgency: string = "";
  description: string = "";
  animalnameslist: string = "";
  // Reasignar tarea
  descriptionR: string = "";
  fileR: File | undefined = undefined;
  userId: number = -1;
  // Agregar tarea
  itemQuantity: number = 0;
  inventoryId: number = -1;
  revisarVariable: string = ""; // Revisar este campo

  constructor(private taskService: TaskService, private toastr: ToastrService, private changeDetector: ChangeDetectorRef) { };

  ngOnInit(): void {
    this.getTasks();
  }

  getTasks() {
    this.taskService.getTask().subscribe({
      next: (responseCorrect) => {
        this.tasksItems = responseCorrect.data;
        this.changeDetector.detectChanges();
      },
      error: (responseError) => {
        this.toastr.error(responseError.error.message);
      }
    });
  }
}
