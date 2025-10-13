import { Routes } from '@angular/router';
import { LoginComponent } from './public/login-component/login-component';
import { RegisterComponent } from './public/register-component/register-component';
import { RecoverComponent } from './public/recover-component/recover-component';

export const routes: Routes = [
    { path: "", component: LoginComponent },
    { path: "login/:id", component: LoginComponent },
    { path: "register", component: RegisterComponent },
    { path: "recover", component: RecoverComponent },
];
