import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Documentacion } from '../documentacion/documentacion';
import { PersonasInvolucradasService } from '../personas-involucradas.service';

@Component({
  imports: [MatIconModule, MatProgressBarModule, RouterLink, Documentacion],
  selector: 'app-documentos',
  styleUrl: './documentos.scss',
  templateUrl: './documentos.html',
})
export class Documentos {
  private readonly personasService = inject(PersonasInvolucradasService);
  readonly selectedName = this.personasService.selectedName;
  readonly selectedPersonaId = this.personasService.selectedPersonaId;
  readonly puedeAgregarPersonaVinculada = computed(() => {
    const id = this.selectedPersonaId();
    if (id === null) return false;
    const persona = this.personasService.personas().find((item) => item.id === id);
    return persona !== undefined
      && persona.vinculadaConId === undefined
      && (persona.nivel ?? 0) === 0;
  });
  completionPercentage = 0;
}
