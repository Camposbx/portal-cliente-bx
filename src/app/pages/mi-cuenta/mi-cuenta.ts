import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ContactData, ContactDialogData, ContactType, ContactoDialog } from './contacto-dialog';

@Component({
  imports: [MatIconModule],
  selector: 'app-mi-cuenta',
  styleUrl: './mi-cuenta.scss',
  templateUrl: './mi-cuenta.html',
})
export class MiCuenta {
  private readonly dialog = inject(MatDialog);

  readonly contacts: ContactData[] = [
    { type: 'email', label: 'Correo principal', value: 'juan.vasquez@elpatito.com.mx' },
    { type: 'email', label: 'Correo alterno', value: 'juan.vasquez.personal@gmail.com' },
    { type: 'phone', label: 'Teléfono móvil', value: '55 4412 8890' },
    { type: 'phone', label: 'Teléfono de oficina', value: '55 5286 1200 ext. 145' },
  ];

  readonly secondaryUsers = [
    { initials: 'MD', name: 'Marco Díaz', email: 'marco@elpatito.com.mx', status: 'Activo' },
    {
      initials: 'SP',
      name: 'Sofía Peña',
      email: 'sofia@elpatito.com.mx',
      status: 'Invitación pendiente',
    },
  ];

  abrirContacto(type: ContactType, contact?: ContactData): void {
    const data: ContactDialogData = {
      type,
      mode: contact ? 'edit' : 'add',
      contact,
    };

    this.dialog
      .open(ContactoDialog, {
        ariaLabelledBy: 'contact-dialog-title',
        backdropClass: 'mi-cuenta-dialog-backdrop',
        data,
        maxWidth: 'calc(100vw - 32px)',
        panelClass: 'mi-cuenta-contact-dialog',
        width: '328px',
      })
      .afterClosed()
      .subscribe((result: ContactData | undefined) => {
        if (!result) {
          return;
        }

        if (contact) {
          const index = this.contacts.indexOf(contact);
          if (index !== -1) {
            this.contacts[index] = result;
          }
          return;
        }

        this.contacts.push(result);
      });
  }

  eliminarContacto(contact: ContactData): void {
    if (contact.label === 'Correo principal') {
      return;
    }

    const index = this.contacts.indexOf(contact);
    if (index !== -1) {
      this.contacts.splice(index, 1);
    }
  }
}
