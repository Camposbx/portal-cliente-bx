import { Component, inject } from '@angular/core';
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
  readonly selectedName = inject(PersonasInvolucradasService).selectedName;
  completionPercentage = 0;
}
