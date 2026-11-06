import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PersonaInvolucrada, PersonasInvolucradasService, TipoPersona } from '../personas-involucradas.service';

interface PersonaArbol extends PersonaInvolucrada {
  hijos: PersonaArbol[];
}

interface PersonaEjemplo {
  id: string;
  nombre: string;
  tipo: TipoPersona;
  rol: string;
  vinculadaCon: string;
  hijos: PersonaEjemplo[];
}

@Component({
  selector: 'app-personas-involucradas',
  imports: [MatIconModule, MatTabsModule, NgTemplateOutlet, RouterLink],
  templateUrl: './personas-involucradas.html',
  styleUrl: './personas-involucradas.scss',
})
export class PersonasInvolucradas {
  private readonly personasService = inject(PersonasInvolucradasService);
  private readonly route = inject(ActivatedRoute);
  private readonly queryParams = toSignal(this.route.queryParamMap, { initialValue: this.route.snapshot.queryParamMap });
  readonly selectedTab = computed(() => this.queryParams().get('vista') === 'arbol' ? 1 : 0);
  readonly personaSeleccionadaId = computed(() => {
    const id = this.queryParams().get('seleccionada');
    if (id === null || !/^(0|[1-9]\d*)$/.test(id)) return null;
    const numero = Number(id);
    return Number.isSafeInteger(numero) ? numero : null;
  });

  readonly nombreSolicitante = this.personasService.nombreSolicitante;
  readonly personas = this.personasService.personas;
  readonly personasPorId = computed(() => new Map(this.personas().map((persona) => [persona.id, persona])));
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
  readonly ejemplo: PersonaEjemplo[] = [
    {
      id: 'principal',
      nombre: 'María García López',
      tipo: 'fisica',
      rol: 'Persona principal',
      vinculadaCon: '—',
      hijos: [
        {
          id: 'aval',
          nombre: 'Juan Pérez Martínez',
          tipo: 'fisica',
          rol: 'Aval',
          vinculadaCon: 'María García López',
          hijos: [
            {
              id: 'aval-del-aval',
              nombre: 'Ana Rodríguez Sánchez',
              tipo: 'fisica',
              rol: 'Aval',
              vinculadaCon: 'Juan Pérez Martínez',
              hijos: [],
            },
          ],
        },
      ],
    },
  ];
  readonly filasEjemplo = this.aplanar(this.ejemplo);

  nombreVinculo(persona: PersonaInvolucrada): string {
    if (persona.vinculadaConId === undefined) return 'Sin vínculo registrado';
    return this.personasPorId().get(persona.vinculadaConId)?.nombre ?? 'Vínculo no disponible';
  }

  tipoPersona(tipo?: TipoPersona): string {
    return tipo === 'fisica' ? 'Persona física' : tipo === 'moral' ? 'Persona moral' : 'No especificado';
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

  private aplanar(personas: PersonaEjemplo[]): PersonaEjemplo[] {
    return personas.flatMap((persona) => [persona, ...this.aplanar(persona.hijos)]);
  }
}
