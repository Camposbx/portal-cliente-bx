import { Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { PersonasInvolucradasService } from '../personas-involucradas.service';

@Component({
  imports: [MatButtonModule, MatIconModule, RouterLink, RouterOutlet],
  selector: 'app-analisis-layout',
  styleUrl: './analisis-layout.scss',
  templateUrl: './analisis-layout.html',
})
export class AnalisisLayout {
  private readonly personasService = inject(PersonasInvolucradasService);

  readonly nombreSolicitante = this.personasService.nombreSolicitante;
  readonly mostrarEjemplos = signal(false);
  readonly personaEjemploPrincipal = {
    id: 'solicitante',
    nombre: 'Comercializadora del Centro, S.A. de C.V.',
    tipoPersona: 'moral' as const,
  };
  readonly personasEjemplo = [
    { id: 'aval-1', nombre: 'Carlos Eduardo Ramírez Torres', roles: ['aval'], nivel: 1 },
    { id: 'garante-2', nombre: 'Ana Sofía Martínez Cruz', roles: ['garante'], nivel: 2 },
    { id: 'aval-3', nombre: 'Roberto Hernández Silva', roles: ['aval'], nivel: 3 },
    { id: 'garante-4', nombre: 'Laura Beatriz Gómez Ruiz', roles: ['garante'], nivel: 4 },
    { id: 'aval-5', nombre: 'Miguel Ángel Torres Vega', roles: ['aval'], nivel: 5 },
  ];
  readonly personas = this.personasService.personas;
  readonly personasVisuales = computed(() =>
    [...this.personas()]
      .map((persona) => ({
        ...persona,
        nivel: persona.nivel ?? 0,
      }))
      .sort((a, b) => (a.nivel ?? 0) - (b.nivel ?? 0)),
  );
  readonly selectedName = this.personasService.selectedName;

  seleccionarSolicitante(): void {
    this.personasService.seleccionarSolicitante();
  }

  seleccionarPersona(persona: string): void {
    this.personasService.seleccionarPersona(persona);
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

  toggleEjemplos(): void {
    this.mostrarEjemplos.update((mostrar) => !mostrar);
  }
}
