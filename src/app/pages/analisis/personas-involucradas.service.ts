import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PersonasInvolucradasService {
  readonly personas = signal<string[]>([]);

  agregar(nombre: string): void {
    const nombreLimpio = nombre.trim();
    if (nombreLimpio) {
      this.personas.update((personas) => [...personas, nombreLimpio]);
    }
  }
}
