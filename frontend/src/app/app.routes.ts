import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/login/login').then((m) => m.LoginPage),
  },
  {
    path: 'register',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/register/register').then((m) => m.RegisterPage),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.DashboardPage),
  },
  {
    path: 'people',
    canActivate: [authGuard],
    loadComponent: () => import('./features/people/list/people-list').then((m) => m.PeopleListPage),
  },
  {
    path: 'people/new',
    canActivate: [authGuard],
    loadComponent: () => import('./features/people/form/person-form').then((m) => m.PersonFormPage),
  },
  {
    path: 'people/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/people/detail/person-detail').then((m) => m.PersonDetailPage),
  },
  {
    path: 'people/:id/edit',
    canActivate: [authGuard],
    loadComponent: () => import('./features/people/form/person-form').then((m) => m.PersonFormPage),
  },
  {
    path: 'settings',
    canActivate: [authGuard],
    loadComponent: () => import('./features/settings/settings').then((m) => m.SettingsPage),
  },
  { path: '**', redirectTo: 'dashboard' },
];
