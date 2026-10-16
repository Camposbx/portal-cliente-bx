import { Routes } from '@angular/router';

export const ANALISIS_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'documentos' },
  {
    path: '',
    loadComponent: () => import('./analisis-layout/analisis-layout').then((page) => page.AnalisisLayout),
    children: [
      {
        path: 'documentos',
        loadComponent: () => import('./documentos/documentos').then((page) => page.Documentos),
      },
      {
        path: 'perfil',
        loadComponent: () => import('./perfil/perfil').then((page) => page.Perfil),
      },
      {
        path: 'registro-persona',
        loadComponent: () => import('./registro-persona/registro-persona').then((page) => page.RegistroPersona),
      },
    ],
  },
];
