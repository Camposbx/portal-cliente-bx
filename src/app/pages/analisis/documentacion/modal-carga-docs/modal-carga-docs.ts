import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

export interface ModalCargaDocsData {
  documentName: string;
}

@Component({
  imports: [MatDialogModule],
  selector: 'app-modal-carga-docs',
  styleUrl: './modal-carga-docs.scss',
  templateUrl: './modal-carga-docs.html',
})
export class ModalCargaDocs {
  private readonly dialogRef = inject(MatDialogRef<ModalCargaDocs, File | undefined>);
  readonly documentName = inject<ModalCargaDocsData>(MAT_DIALOG_DATA).documentName;

  selectedFile: File | null = null;
  errorMessage = '';
  dragging = false;

  cancelar(): void {
    this.dialogRef.close();
  }

  cargar(): void {
    if (this.selectedFile) {
      this.dialogRef.close(this.selectedFile);
    }
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.selectFile(file);
    input.value = '';
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.dragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.dragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragging = false;
    this.selectFile(event.dataTransfer?.files[0] ?? null);
  }

  private selectFile(file: File | null): void {
    this.errorMessage = '';
    this.selectedFile = null;

    if (!file) {
      return;
    }

    const extension = file.name.split('.').pop()?.toLowerCase();
    const allowedExtensions = ['xls', 'xlsx', 'csv', 'png', 'jpg', 'jpeg', 'pdf'];

    if (!extension || !allowedExtensions.includes(extension)) {
      this.errorMessage = 'El formato del archivo no es válido.';
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      this.errorMessage = 'El archivo supera el límite de 20 MB.';
      return;
    }

    this.selectedFile = file;
  }
}
