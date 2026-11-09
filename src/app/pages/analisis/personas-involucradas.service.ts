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
  tipoDomicilio?: string | string[];
  codigoPostal?: string;
  entidad?: string;
  municipio?: string;
  colonia?: string;
  calle?: string;
  numeroExterior?: string;
  numeroInterior?: string;
  direccionPrincipal?: boolean;
}

export interface PersonaInvolucrada {
  id: number;
  nombre: string;
  correo: string;
  roles: string[];
  tipo?: TipoPersona;
  tipoPersona?: TipoPersona;
  vinculadaConId?: number;
  datos?: DatosPersona;
  nivel?: number;
}

export interface OpcionesPersona {
  vinculadaConId?: number;
  datos?: DatosPersona;
  nivel?: number;
}

@Injectable({ providedIn: 'root' })
export class PersonasInvolucradasService {
  readonly personas = signal<PersonaInvolucrada[]>([]);
  readonly nombreSolicitante = 'ASOCIACION MEXICANA PARA LAS NACIONES UNIDAS DE JOVENES AMNU JOVENES';
  readonly selectedName = signal(this.nombreSolicitante);
  readonly selectedPersonaId = signal<number | null>(null);
  private nextPersonaId = 0;

  seleccionarSolicitante(): void {
    this.selectedName.set(this.nombreSolicitante);
    this.selectedPersonaId.set(null);
  }

  seleccionarPersona(nombre: string, id?: number): void {
    this.selectedName.set(nombre);
    this.selectedPersonaId.set(id ?? null);
  }

  agregar(
    nombre: string,
    correo: string,
    roles: string[],
    tipo?: TipoPersona,
    opcionesOId?: OpcionesPersona | number,
    datosAnteriores?: DatosPersona,
  ): boolean {
    // The numeric fifth argument remains a linked-person ID for existing callers.
    const opciones: OpcionesPersona = typeof opcionesOId === 'object'
      ? opcionesOId
      : { vinculadaConId: opcionesOId, datos: datosAnteriores };
    const { vinculadaConId, datos } = opciones;
    const nivel = opciones.nivel ?? 0;
    const nombreLimpio = nombre.trim();
    if (
      !nombreLimpio ||
      (vinculadaConId !== undefined && !this.personas().some((persona) => persona.id === vinculadaConId))
    ) {
      return false;
    }

    const nivelSeguro = Number.isFinite(nivel) ? Math.max(0, Math.floor(nivel)) : 0;
    this.personas.update((personas) => [
      ...personas,
      {
        id: this.nextPersonaId++, nombre: nombreLimpio, correo: correo.trim(), roles: [...roles],
        tipo, tipoPersona: tipo, vinculadaConId, datos: datos ? { ...datos } : undefined, nivel: nivelSeguro,
      },
    ]);
    return true;
  }

  actualizar(id: number, nombre: string, correo: string, roles: string[], tipo: TipoPersona, datos: DatosPersona): boolean {
    const nombreLimpio = nombre.trim();
    const persona = this.personas().find((item) => item.id === id);
    if (!persona || !nombreLimpio) return false;

    this.personas.update((personas) => personas.map((item) => item.id === id
      ? { ...item, nombre: nombreLimpio, correo: correo.trim(), roles: [...roles], tipo, tipoPersona: tipo, datos: { ...datos } }
      : item));
    if (this.selectedName() === persona.nombre) this.selectedName.set(nombreLimpio);
    return true;
  }

  eliminar(id: number): boolean {
    const personas = this.personas();
    if (!personas.some((persona) => persona.id === id)) return false;

    const idsEliminados = new Set([id]);
    let huboNuevosDescendientes = true;
    while (huboNuevosDescendientes) {
      huboNuevosDescendientes = false;
      for (const persona of personas) {
        if (
          persona.vinculadaConId !== undefined &&
          idsEliminados.has(persona.vinculadaConId) &&
          !idsEliminados.has(persona.id)
        ) {
          idsEliminados.add(persona.id);
          huboNuevosDescendientes = true;
        }
      }
    }

    this.personas.set(personas.filter((persona) => !idsEliminados.has(persona.id)));
    const personaSeleccionadaId = this.selectedPersonaId();
    if (personaSeleccionadaId !== null && idsEliminados.has(personaSeleccionadaId)) {
      this.seleccionarSolicitante();
    }
    return true;
  }
}
