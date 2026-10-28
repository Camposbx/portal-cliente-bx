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
    { label: 'Inicio', path: '/inicio', icon: 'icons/home.svg' },
    { label: 'Análisis', path: '/analisis', icon: 'icons/document_search.svg' },
    { label: 'Contratación', path: '/contratacion', icon: 'icons/documet_check.svg' },
    { label: 'Operación', path: '/operacion', icon: 'icons/folder.svg' },
    { label: 'Mi ejecutivo', path: '/mi-ejecutivo', icon: 'icons/document_edit.svg' },
    { label: 'Ayuda', path: '/ayuda', icon: 'icons/question.svg' },
  ];
}
