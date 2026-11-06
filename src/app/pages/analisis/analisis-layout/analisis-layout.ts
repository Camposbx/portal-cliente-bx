import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { PersonaInvolucrada, PersonasInvolucradasService } from '../personas-involucradas.service';

interface PersonaArbolVisual extends PersonaInvolucrada {
  hijos: PersonaArbolVisual[];
}

@Component({
  imports: [MatButtonModule, MatIconModule, NgTemplateOutlet, RouterLink, RouterOutlet],
  selector: 'app-analisis-layout',
  styleUrl: './analisis-layout.scss',
  templateUrl: './analisis-layout.html',
})
export class AnalisisLayout {
  private readonly personasService = inject(PersonasInvolucradasService);

  readonly nombreSolicitante = this.personasService.nombreSolicitante;
  readonly personas = this.personasService.personas;
  readonly arbolPersonas = computed(() => {
    const nodos = new Map<number, PersonaArbolVisual>(
      this.personas().map((persona) => [
        persona.id,
        { ...persona, hijos: [] },
      ]),
    );
    const raices: PersonaArbolVisual[] = [];

    for (const nodo of nodos.values()) {
      const padre = nodo.vinculadaConId === undefined ? undefined : nodos.get(nodo.vinculadaConId);
      if (padre) padre.hijos.push(nodo);
      else raices.push(nodo);
    }
    const ordenar = (personas: PersonaArbolVisual[]): void => {
      personas.sort((a, b) => (a.nivel ?? 0) - (b.nivel ?? 0));
      for (const persona of personas) ordenar(persona.hijos);
    };
    ordenar(raices);
    return raices;
  });
  readonly selectedName = this.personasService.selectedName;
  readonly selectedPersonaId = this.personasService.selectedPersonaId;

  seleccionarSolicitante(): void {
    this.personasService.seleccionarSolicitante();
  }

  seleccionarPersona(persona: PersonaInvolucrada): void {
    this.personasService.seleccionarPersona(persona.nombre, persona.id);
  }

  etiquetaRoles(roles: string[]): string {
    const etiquetas: Record<string, string> = {
      aval: 'Aval (AV)',
      apoderado: 'Apoderado Legal (AL)',
      accionista: 'Accionista (AC)',
      garante: 'Garante (GA)',
      depositario: 'Depositario legal (DL)',
    };

    return roles.map((rol) => etiquetas[rol] ?? rol).join(', ');
  }

}
