import { Injectable, signal } from '@angular/core';

export type TipoPersona = 'fisica' | 'moral';

export interface DatosPersona {
  nombre1: string;
  nombre2: string;
  nombre3: string;
  primerApellido: string;
  segundoApellido: string;
  razonSocial: string;
  tipoSociedad: string;
  nacionalidad: string;
  curp: string;
  rfc: string;
  estadoCivil: string;
  regimenMatrimonial: string;
  correo: string;
  participacion: string | number | null;
}

export interface PersonaInvolucrada {
  id: number;
  nombre: string;
  correo: string;
  roles: string[];
  tipo?: TipoPersona;
  vinculadaConId?: number;
  datos?: DatosPersona;
}

@Injectable({ providedIn: 'root' })
export class PersonasInvolucradasService {
  readonly personas = signal<PersonaInvolucrada[]>([]);
  readonly nombreSolicitante = 'ASOCIACION MEXICANA PARA LAS NACIONES UNIDAS DE JOVENES AMNU JOVENES';
  readonly selectedName = signal(this.nombreSolicitante);
  private nextPersonaId = 0;

  seleccionarSolicitante(): void {
    this.selectedName.set(this.nombreSolicitante);
  }

  seleccionarPersona(nombre: string): void {
    this.selectedName.set(nombre);
  }

  agregar(
    nombre: string,
    correo: string,
    roles: string[],
    tipo?: TipoPersona,
    vinculadaConId?: number,
    datos?: DatosPersona,
  ): boolean {
    const nombreLimpio = nombre.trim();
    if (
      !nombreLimpio ||
      (vinculadaConId !== undefined && !this.personas().some((persona) => persona.id === vinculadaConId))
    ) {
      return false;
    }

    this.personas.update((personas) => [
      ...personas,
      {
        id: this.nextPersonaId++, nombre: nombreLimpio, correo: correo.trim(), roles: [...roles],
        tipo, vinculadaConId, datos: datos ? { ...datos } : undefined,
      },
    ]);
    return true;
  }

  actualizar(id: number, nombre: string, correo: string, roles: string[], tipo: TipoPersona, datos: DatosPersona): boolean {
    const nombreLimpio = nombre.trim();
    const persona = this.personas().find((item) => item.id === id);
    if (!persona || !nombreLimpio) return false;

    this.personas.update((personas) => personas.map((item) => item.id === id
      ? { ...item, nombre: nombreLimpio, correo: correo.trim(), roles: [...roles], tipo, datos: { ...datos } }
      : item));
    if (this.selectedName() === persona.nombre) this.selectedName.set(nombreLimpio);
    return true;
  }
}
