import { Injectable, signal } from '@angular/core';

export interface PersonaInvolucrada {
  id: number;
  nombre: string;
  correo: string;
  roles: string[];
}

@Injectable({ providedIn: 'root' })
export class PersonasInvolucradasService {
  readonly personas = signal<PersonaInvolucrada[]>([]);
  readonly selectedName = signal(
    'ASOCIACION MEXICANA PARA LAS NACIONES UNIDAS DE JOVENES AMNU JOVENES',
  );
  private nextPersonaId = 0;

  seleccionarSolicitante(): void {
    this.selectedName.set('ASOCIACION MEXICANA PARA LAS NACIONES UNIDAS DE JOVENES AMNU JOVENES');
  }

  seleccionarPersona(nombre: string): void {
    this.selectedName.set(nombre);
  }

  agregar(nombre: string, correo: string, roles: string[]): void {
    const nombreLimpio = nombre.trim();
    if (nombreLimpio) {
      this.personas.update((personas) => [
        ...personas,
        { id: this.nextPersonaId++, nombre: nombreLimpio, correo: correo.trim(), roles: [...roles] },
      ]);
    }
  }
}
