import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/layout/layout').then((page) => page.Layout),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'inicio' },
      {
        path: 'inicio',
        loadComponent: () => import('./pages/dashboard/dashboard-component').then((page) => page.Dashboard),
        title: 'Inicio | Portal BX+',
      },
      {
        path: 'analisis',
        loadComponent: () => import('./pages/analisis/analisis').then((page) => page.Analisis),
        title: 'Análisis | Portal BX+',
      },
      {
        path: 'contratacion',
        loadComponent: () => import('./pages/contratacion/contratacion').then((page) => page.Contratacion),
        title: 'Contratación | Portal BX+',
      },
      {
        path: 'operacion',
        loadComponent: () => import('./pages/operacion/operacion').then((page) => page.Operacion),
        title: 'Operación | Portal BX+',
      },
      {
        path: 'mi-ejecutivo',
        loadComponent: () => import('./pages/mi-ejecutivo/mi-ejecutivo').then((page) => page.MiEjecutivo),
        title: 'Mi ejecutivo | Portal BX+',
      },
      {
        path: 'ayuda',
        loadComponent: () => import('./pages/ayuda/ayuda').then((page) => page.Ayuda),
        title: 'Ayuda | Portal BX+',
      },
    ],
  },
  { path: '**', redirectTo: 'inicio' },
];
