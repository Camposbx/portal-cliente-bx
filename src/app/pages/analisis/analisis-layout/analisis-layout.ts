import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  imports: [MatIconModule, RouterLink, RouterOutlet],
  selector: 'app-analisis-layout',
  styleUrl: './analisis-layout.scss',
  templateUrl: './analisis-layout.html',
})
export class AnalisisLayout {}
