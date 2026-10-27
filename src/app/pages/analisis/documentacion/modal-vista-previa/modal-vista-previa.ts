import { Component, OnDestroy, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

export interface ModalVistaPreviaData {
  documentName: string;
  fileBase64: string | null;
  fileName: string;
  previewError?: string | null;
}

@Component({
  imports: [MatDialogModule],
  selector: 'app-modal-vista-previa',
  styleUrl: './modal-vista-previa.scss',
  templateUrl: './modal-vista-previa.html',
})
export class ModalVistaPrevia implements OnDestroy {
  private readonly dialogRef = inject(MatDialogRef<ModalVistaPrevia>);
  private readonly sanitizer = inject(DomSanitizer);
  readonly data = inject<ModalVistaPreviaData>(MAT_DIALOG_DATA);

  pdfUrl: SafeResourceUrl | null = null;
  previewError = this.data.previewError ?? '';
  private objectUrl: string | null = null;

  constructor() {
    this.initializePreview();
  }

  ngOnDestroy(): void {
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
    }
  }

  cerrar(): void {
    this.dialogRef.close();
  }

  private initializePreview(): void {
    const fileBase64 = this.data.fileBase64;
    if (!fileBase64) {
      return;
    }

    try {
      const base64 = fileBase64.replace(/^data:application\/pdf;base64,/i, '').replace(/\s/g, '');
      const binary = atob(base64);
      const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
      const pdf = new Blob([bytes], { type: 'application/pdf' });

      if (!binary.startsWith('%PDF-')) {
        this.previewError = 'El contenido recibido no es un archivo PDF válido.';
        return;
      }

      this.objectUrl = URL.createObjectURL(pdf);
      this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        `${this.objectUrl}#toolbar=0&navpanes=0&scrollbar=0`,
      );
    } catch {
      this.previewError = 'No fue posible leer el archivo PDF recibido.';
    }
  }
}
