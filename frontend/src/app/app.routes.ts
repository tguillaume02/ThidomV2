import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('@features/auth/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: '',
    loadComponent: () => import('./layout/layout.component').then(m => m.LayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('@features/dashboard/dashboard.component').then(m => m.DashboardComponent),
      },
      {
        path: 'rooms',
        loadComponent: () => import('@features/rooms/rooms.component').then(m => m.RoomsComponent),
      },
      {
        path: 'devices',
        loadComponent: () => import('@features/devices/devices.component').then(m => m.DevicesComponent),
      },
      {
        path: 'plugins',
        loadComponent: () => import('@features/plugins/plugins.component').then(m => m.PluginsComponent),
      },
      {
        path: 'scenarios',
        loadComponent: () => import('@features/scenarios/scenarios.component').then(m => m.ScenariosComponent),
      },
      {
        path: 'schedules',
        loadComponent: () => import('@features/schedules/schedules.component').then(m => m.SchedulesComponent),
      },
      {
        path: 'history',
        loadComponent: () => import('@features/history/history.component').then(m => m.HistoryComponent),
      },
      {
        path: 'logs',
        loadComponent: () => import('@features/logs/logs.component').then(m => m.LogsComponent),
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
