import { Component, inject } from '@angular/core';
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
  readonly personas = inject(PersonasInvolucradasService).personas;
}
