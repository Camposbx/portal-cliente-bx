import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Documentacion } from '../documentacion/documentacion';

@Component({
  imports: [MatIconModule, RouterLink, Documentacion],
  selector: 'app-documentos',
  styleUrl: './documentos.scss',
  templateUrl: './documentos.html',
})
export class Documentos {}
