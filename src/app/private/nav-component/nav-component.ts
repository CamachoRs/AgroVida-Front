import { Component, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { PrivateService } from '../../services/private.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-nav-component',
  imports: [RouterModule],
  templateUrl: './nav-component.html',
  styleUrl: './nav-component.css'
})
export class NavComponent {
  @Input()
  activeLink: string = "Cerrar sesión";

  constructor(private privateService: PrivateService, private toastr: ToastrService, private router: Router) { };

  logout() {
    this.privateService.logout().subscribe({
      next: (responseCorrect) => {
        sessionStorage.clear();
        this.router.navigate(["/"]);
      },
      error: (responseError) => {
        this.toastr.error(responseError.message);
      }
    });
  };
}
