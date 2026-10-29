import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { PersonaInvolucrada } from '../../personas-involucradas.service';

export interface ModalFirmantesData {
  personas: PersonaInvolucrada[];
}

@Component({
  imports: [MatButtonModule, MatCheckboxModule, MatDialogModule, MatIconModule],
  selector: 'app-modal-firmantes',
  styleUrl: './modal-firmantes.scss',
  templateUrl: './modal-firmantes.html',
})
export class ModalFirmantes {
  private readonly dialogRef = inject(MatDialogRef<ModalFirmantes, number[] | 'register'>);
  readonly data = inject<ModalFirmantesData>(MAT_DIALOG_DATA);
  selectedIds: number[] = [];

  togglePersona(id: number, selected: boolean): void {
    if (selected) {
      if (this.selectedIds.length < 2 && !this.selectedIds.includes(id)) {
        this.selectedIds = [...this.selectedIds, id];
      }
      return;
    }

    this.selectedIds = this.selectedIds.filter((selectedId) => selectedId !== id);
  }

  cancelar(): void {
    this.dialogRef.close();
  }

  registrarAhora(): void {
    this.dialogRef.close('register');
  }

  enviar(): void {
    if (this.selectedIds.length > 0) {
      this.dialogRef.close(this.selectedIds);
    }
  }
}
