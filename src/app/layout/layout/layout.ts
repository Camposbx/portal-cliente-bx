import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  selector: 'app-layout',
  styleUrl: './layout.scss',
  templateUrl: './layout.html',
})
export class Layout {
  protected readonly navigation = [
    { label: 'Inicio', path: '/inicio', icon: 'home' },
    { label: 'Análisis', path: '/analisis', icon: 'analysis' },
    { label: 'Contratación', path: '/contratacion', icon: 'contract' },
    { label: 'Operación', path: '/operacion', icon: 'operation' },
    { label: 'Mi ejecutivo', path: '/mi-ejecutivo', icon: 'executive' },
    { label: 'Ayuda', path: '/ayuda', icon: 'help' },
  ];
}
