import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PersonaInvolucrada, PersonasInvolucradasService } from '../personas-involucradas.service';

interface PersonaArbol extends PersonaInvolucrada {
  hijos: PersonaArbol[];
}

@Component({
  selector: 'app-personas-involucradas',
  imports: [MatIconModule, NgTemplateOutlet, RouterLink],
  templateUrl: './personas-involucradas.html',
  styleUrl: './personas-involucradas.scss',
})
export class PersonasInvolucradas {
  private readonly personasService = inject(PersonasInvolucradasService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly queryParams = toSignal(this.route.queryParamMap, { initialValue: this.route.snapshot.queryParamMap });
  readonly personaSeleccionadaId = computed(() => {
    const id = this.queryParams().get('seleccionada');
    if (id === null || !/^(0|[1-9]\d*)$/.test(id)) return null;
    const numero = Number(id);
    return Number.isSafeInteger(numero) ? numero : null;
  });

  readonly nombreSolicitante = this.personasService.nombreSolicitante;
  readonly personas = this.personasService.personas;
  readonly arbol = computed(() => {
    const nodos = new Map<number, PersonaArbol>(
      this.personas().map((persona) => [persona.id, { ...persona, hijos: [] }]),
    );
    const raices: PersonaArbol[] = [];
    for (const nodo of nodos.values()) {
      const padre = nodo.vinculadaConId === undefined ? undefined : nodos.get(nodo.vinculadaConId);
      if (padre) {
        padre.hijos.push(nodo);
      } else {
        raices.push(nodo);
      }
    }
    return raices;
  });
  abrirDocumentacion(event: MouseEvent, persona: PersonaInvolucrada): void {
    if (event.target instanceof Element && event.target.closest('.tree-actions')) return;

    this.personasService.seleccionarPersona(persona.nombre, persona.id);
    void this.router.navigateByUrl('/analisis/documentos');
  }

  eliminarPersona(persona: PersonaInvolucrada): void {
    const confirmado = window.confirm(
      `¿Eliminar a ${persona.nombre} y a todas las personas vinculadas debajo de ella?`,
    );
    if (confirmado) this.personasService.eliminar(persona.id);
  }

  nombreRol(rol: string): string {
    const nombres: Record<string, string> = {
      aval: 'Aval',
      apoderado: 'Apoderado legal',
      accionista: 'Accionista',
      garante: 'Garante',
      depositario: 'Depositario legal',
    };
    return nombres[rol] ?? rol;
  }
}
