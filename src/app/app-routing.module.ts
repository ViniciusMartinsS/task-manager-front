import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ProjectComponent } from './project/project.component';
import { TaskComponent } from './task/task.component';
import { AuthGuard } from './guard/auth.guard';


const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'projects',
    component: ProjectComponent,
    canActivate: [
      AuthGuard
    ]
  },
  {
    path: 'tasks/:projectId',
    component: TaskComponent,
    canActivate: [
      AuthGuard
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
