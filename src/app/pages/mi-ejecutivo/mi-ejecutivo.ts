import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  imports: [MatIconModule],
  selector: 'app-mi-ejecutivo',
  styleUrl: './mi-ejecutivo.scss',
  templateUrl: './mi-ejecutivo.html',
})
export class MiEjecutivo {
  readonly ejecutivo = {
    nombre: 'Carlos',
    apellidos: 'Méndez',
    cargo: 'Tu ejecutivo de cuenta',
    horarioAtencion: '9am a 6pm · Lun. a Vie.',
    correo: 'carlos.mendez@vepormas.com',
    telefono: '55 1234 1234',
    codigoPais: '52',
    sucursal: {
      nombre: 'Reforma',
      direccion: 'Av. Paseo de la Reforma 505, CDMX',
    },
    suplente: {
      nombre: 'Diana Ortega',
      cargo: 'Ejecutiva suplente',
      iniciales: 'DO',
      correo: 'diana.ortega@vepormas.com',
    },
  };

  get whatsappUrl(): string {
    const numero = this.ejecutivo.telefono.replace(/\D/g, '');
    return `https://web.whatsapp.com/send?phone=${this.ejecutivo.codigoPais}${numero}`;
  }

  get sucursalUrl(): string {
    return `https://maps.google.com/?q=${encodeURIComponent(this.ejecutivo.sucursal.direccion)}`;
  }
}
