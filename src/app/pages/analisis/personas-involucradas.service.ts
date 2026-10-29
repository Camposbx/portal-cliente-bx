import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PersonasInvolucradasService {
  readonly personas = signal<string[]>([]);
  readonly selectedName = signal(
    'ASOCIACION MEXICANA PARA LAS NACIONES UNIDAS DE JOVENES AMNU JOVENES',
  );

  seleccionarSolicitante(): void {
    this.selectedName.set('ASOCIACION MEXICANA PARA LAS NACIONES UNIDAS DE JOVENES AMNU JOVENES');
  }

  seleccionarPersona(nombre: string): void {
    this.selectedName.set(nombre);
  }

  agregar(nombre: string): void {
    const nombreLimpio = nombre.trim();
    if (nombreLimpio) {
      this.personas.update((personas) => [...personas, nombreLimpio]);
    }
  }
}
