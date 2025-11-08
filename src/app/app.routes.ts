import { Routes } from '@angular/router';
import { LoginComponent } from './public/login-component/login-component';
import { RegisterComponent } from './public/register-component/register-component';
import { RecoverComponent } from './public/recover-component/recover-component';
import { TasksComponent } from './private/tasks-component/tasks-component';
import { InventoryComponent } from './private/inventory-component/inventory-component';
import { authGuardGuardIn, authGuardGuardOut } from './services/auth.guard-guard';
import { ProfileComponent } from './private/profile-component/profile-component';
import { UsersComponent } from './private/users-component/users-component';
import { NewsComponent } from './private/news-component/news-component';
import { AnimalsComponent } from './private/animals-component/animals-component';

export const routes: Routes = [
    { path: "", component: LoginComponent, canActivate: [authGuardGuardIn] },
    { path: "login/:id", component: LoginComponent, canActivate: [authGuardGuardIn] },
    { path: "register", component: RegisterComponent, canActivate: [authGuardGuardIn] },
    { path: "recover", component: RecoverComponent, canActivate: [authGuardGuardIn] },

    { path: "profile", component: ProfileComponent, canActivate: [authGuardGuardOut] },
    { path: "users", component: UsersComponent, canActivate: [authGuardGuardOut] },
    { path: "inventory", component: InventoryComponent, canActivate: [authGuardGuardOut] },
    { path: "news", component: NewsComponent, canActivate: [authGuardGuardOut] },
    { path: "tasks", component: TasksComponent, canActivate: [authGuardGuardOut] },
    { path: "animals", component: AnimalsComponent, canActivate: [authGuardGuardOut] },
];