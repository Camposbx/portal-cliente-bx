import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

export type MessageDialogType = 'question' | 'success' | 'warning' | 'error' | 'info';

export interface MessageDialogData {
  type: MessageDialogType;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string | null;
}

@Component({
  imports: [MatDialogModule],
  selector: 'app-message-dialog',
  styleUrl: './message-dialog.scss',
  templateUrl: './message-dialog.html',
})
export class MessageDialog {
  readonly data = inject<MessageDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<MessageDialog, boolean>);

  get confirmText(): string {
    return this.data.confirmText ?? (this.data.type === 'question' ? 'Aceptar' : 'Entendido');
  }

  get cancelText(): string | null {
    if (this.data.cancelText !== undefined) return this.data.cancelText;
    return this.data.type === 'question' ? 'Cancelar' : null;
  }

  aceptar(): void {
    this.dialogRef.close(true);
  }

  cancelar(): void {
    this.dialogRef.close(false);
  }
}
