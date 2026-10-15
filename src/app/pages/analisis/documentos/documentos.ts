import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  imports: [MatIconModule, RouterLink],
  selector: 'app-documentos',
  styleUrl: './documentos.scss',
  templateUrl: './documentos.html',
})
export class Documentos {}
