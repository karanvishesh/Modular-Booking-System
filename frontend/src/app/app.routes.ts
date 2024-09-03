import { Routes } from '@angular/router';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { NoAuthGuard } from './noauth.guard';
import { HomePageComponent } from './components/home-page/home-page.component';
import { AuthGuard } from './auth.guard';
import { RegisterPageComponent } from './components/register-page/register-page.component';
import { DatabaseDetailPageComponent } from './components/database-detail-page/database-detail-page.component';

export const routes: Routes = [
  { path: 'login', component: LoginPageComponent, canActivate: [NoAuthGuard] },
  { path: 'register', component: RegisterPageComponent, canActivate: [NoAuthGuard] },
  { path: 'home', component: HomePageComponent, canActivate: [AuthGuard] },
  { path: 'database/:id', component: DatabaseDetailPageComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' }
];
