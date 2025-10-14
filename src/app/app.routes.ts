import { Routes } from '@angular/router';
import { LoginComponent } from './public/login-component/login-component';
import { RegisterComponent } from './public/register-component/register-component';
import { RecoverComponent } from './public/recover-component/recover-component';
import { TasksComponent } from './private/tasks-component/tasks-component';
import { InventoryComponent } from './private/inventory-component/inventory-component';

export const routes: Routes = [
    { path: "", component: LoginComponent },
    { path: "login/:id", component: LoginComponent },
    { path: "register", component: RegisterComponent },
    { path: "recover", component: RecoverComponent },

    // Validar esto para que puedan acceder solo los autenticados
    { path: "tasks", component: TasksComponent },
    { path: "inventory", component: InventoryComponent },
];
