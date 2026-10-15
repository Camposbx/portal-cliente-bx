import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  imports: [FormsModule, MatButtonModule, MatCheckboxModule, MatDialogModule],
  selector: 'app-modal-portal-uso',
  styleUrl: './modal-portal-uso.scss',
  templateUrl: './modal-portal-uso.html',
})
export class ModalPortalUso {
  private readonly dialogRef = inject(MatDialogRef<ModalPortalUso, boolean>);

  termsAccepted = false;

  cancelar(): void {
    this.dialogRef.close(false);
  }

  aceptar(): void {
    if (this.termsAccepted) {
      this.dialogRef.close(true);
    }
  }
}
