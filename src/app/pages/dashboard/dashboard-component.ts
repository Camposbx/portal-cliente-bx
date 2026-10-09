import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';

@Component({
  imports: [
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
    MatSelectModule,
    MatTableModule,
  ],
  selector: 'app-dashboard',
  styleUrl: './dashboard-component.scss',
  templateUrl: './dashboard-component.html',
})
export class Dashboard {
  protected readonly metrics = [
    {
      label: 'Servicios activos',
      value: '12',
      caption: 'En 4 sucursales',
      change: '+2 este mes',
      changeTone: 'positive',
      symbol: 'S',
      tone: 'lime',
    },
    {
      label: 'Solicitudes abiertas',
      value: '03',
      caption: '1 requiere atención',
      change: 'En seguimiento',
      changeTone: 'informative',
      symbol: '!',
      tone: 'blue',
    },
    {
      label: 'Saldo disponible',
      value: '$48,250',
      caption: 'Actualizado hoy',
      change: 'Al corriente',
      changeTone: 'positive',
      symbol: '$',
      tone: 'green',
    },
    {
      label: 'Próximo vencimiento',
      value: '18 oct',
      caption: 'Factura de servicios',
      change: 'En 9 días',
      changeTone: 'warning',
      symbol: '◷',
      tone: 'yellow',
    },
  ];

  protected readonly displayedColumns = ['movement', 'date', 'amount', 'status'];

  protected readonly transactions = [
    {
      name: 'Pago de servicios',
      reference: 'Referencia · BX-10482',
      date: '09 oct 2026',
      amount: '$12,450.00',
      status: 'Completado',
      statusTone: 'success',
      symbol: '$',
      tone: 'green',
    },
    {
      name: 'Solicitud de instalación',
      reference: 'Solicitud · SOL-2891',
      date: '08 oct 2026',
      amount: '—',
      status: 'En proceso',
      statusTone: 'info',
      symbol: '+',
      tone: 'blue',
    },
    {
      name: 'Actualización de contrato',
      reference: 'Contrato · CT-58302',
      date: '06 oct 2026',
      amount: '—',
      status: 'Pendiente',
      statusTone: 'warning',
      symbol: '↻',
      tone: 'yellow',
    },
    {
      name: 'Pago de servicios',
      reference: 'Referencia · BX-10376',
      date: '02 oct 2026',
      amount: '$8,900.00',
      status: 'Completado',
      statusTone: 'success',
      symbol: '$',
      tone: 'green',
    },
  ];

  protected readonly services = [
    { name: 'Servicios contratados', value: '12', tone: 'lime' },
    { name: 'Solicitudes en curso', value: '3', tone: 'blue' },
    { name: 'Pagos realizados', value: '8', tone: 'green' },
  ];
}
