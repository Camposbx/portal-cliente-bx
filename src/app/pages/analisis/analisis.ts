import { Component } from '@angular/core';
import { Documentacion } from './documentacion/documentacion';

@Component({
  imports: [Documentacion],
  selector: 'app-analisis',
  styleUrl: './analisis.scss',
  templateUrl: './analisis.html',
})
export class Analisis {}
