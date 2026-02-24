import { provideRouter, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { BoardComponent } from './board/board.component';
import { authGuard } from './auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { 
    path: 'board', 
    component: BoardComponent,
    canActivate: [authGuard]
  }
];

export const appConfig = {
  providers: [provideRouter(routes)]
};