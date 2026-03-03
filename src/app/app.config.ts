import { provideRouter, Routes } from '@angular/router';
import { authGuard } from './auth.guard';

const routes: Routes = [

  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.component')
        .then(m => m.LoginComponent)
  },

  {
    path: 'register',
    loadComponent: () =>
      import('./register/register.component')
        .then(m => m.RegisterComponent)
  },

  {
    path: 'board',
    loadComponent: () =>
      import('./board/board.component')
        .then(m => m.BoardComponent),
    canActivate: [authGuard]
  }

];

export const appConfig = {
  providers: [provideRouter(routes)]
};