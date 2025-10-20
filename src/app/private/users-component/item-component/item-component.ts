import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { User } from '../../../models/User.model';
import { ToastrService } from 'ngx-toastr';
import { EmployService } from '../../../services/employ.service';

@Component({
  selector: 'app-item-component',
  imports: [],
  templateUrl: './item-component.html',
  styleUrl: './item-component.css'
})
export class ItemComponent implements OnInit {
  @Output()
  changeTab = new EventEmitter<{ tab: string, user: User }>();
  users: User[] = [];

  constructor(private employServices: EmployService, private toastr: ToastrService, private changeDetector: ChangeDetectorRef) { };

  ngOnInit(): void {
    this.listUsers();
  };

  requestChange(newTab: string, user: User) {
    this.changeTab.emit({ tab: newTab, user: user });
  }

  listUsers() {
    this.employServices.getEmployees().subscribe({
      next: (responseCorrect) => {
        this.users = responseCorrect.data;
        this.changeDetector.detectChanges();
      },
      error: (responseError) => {
        this.toastr.error(responseError.error.message);
      }
    });
  };
}
