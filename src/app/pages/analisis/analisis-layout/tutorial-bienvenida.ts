import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

export interface TutorialBienvenidaData {
  step: 1 | 2 | 3 | 4 | 5;
}

@Component({
  imports: [MatDialogModule],
  selector: 'app-tutorial-bienvenida',
  templateUrl: './tutorial-bienvenida.html',
  styleUrl: './tutorial-bienvenida.scss',
})
export class TutorialBienvenida implements AfterViewInit {
  private readonly dialogRef = inject(MatDialogRef<TutorialBienvenida, 'back' | 'next'>);
  private readonly document = inject(DOCUMENT);
  readonly data = inject<TutorialBienvenidaData>(MAT_DIALOG_DATA);

  ngAfterViewInit(): void {
    if (this.data.step === 1) return;
    this.enfocarSeccion();
  }

  regresar(): void {
    this.dialogRef.close('back');
  }

  siguiente(): void {
    this.dialogRef.close('next');
  }

  private enfocarSeccion(): void {
    const targetSelector = this.data.step === 2
      ? '.applicant-card'
      : this.data.step === 3
        ? '.document-tabs'
        : this.data.step === 4 ? '.document-upload-area' : '.people-card';
    const target = this.document.querySelector<HTMLElement>(targetSelector);
    const backdrop = this.document.querySelector<HTMLElement>('.analysis-tutorial-backdrop--spotlight');
    const window = this.document.defaultView;
    if (!target || !backdrop || !window) return;
    const dialogWidth = this.document
      .querySelector<HTMLElement>('.analysis-tutorial-panel')
      ?.getBoundingClientRect().width || (this.data.step === 4 ? 320 : 360);

    const rect = target.getBoundingClientRect();
    const padding = 6;
    const top = Math.max(0, rect.top - padding);
    const left = Math.max(0, rect.left - padding);
    const right = Math.min(window.innerWidth, rect.right + padding);
    const documentRows = this.data.step === 4
      ? target.querySelectorAll<HTMLElement>('.documents-table tbody tr')
      : [];
    const lastHighlightedRow = documentRows[Math.min(documentRows.length, 3) - 1];
    const focusBottom = lastHighlightedRow
      ? Math.min(rect.bottom, lastHighlightedRow.getBoundingClientRect().bottom)
      : rect.bottom;
    const bottom = Math.min(window.innerHeight, focusBottom + padding);
    backdrop.style.setProperty('--spot-top', `${top}px`);
    backdrop.style.setProperty('--spot-left', `${left}px`);
    backdrop.style.setProperty('--spot-right', `${right}px`);
    backdrop.style.setProperty('--spot-bottom', `${bottom}px`);
    backdrop.style.setProperty('--spot-width', `${right - left}px`);
    backdrop.style.setProperty('--spot-height', `${bottom - top}px`);

    if (window.innerWidth > 640 && this.data.step === 2) {
      this.dialogRef.updatePosition({
        top: `${Math.max(16, top)}px`,
        left: `${Math.max(16, Math.min(right + 16, window.innerWidth - dialogWidth - 16))}px`,
      });
    } else if (window.innerWidth > 640 && this.data.step === 3) {
      this.dialogRef.updatePosition({
        top: `${Math.min(bottom + 28, window.innerHeight - 200)}px`,
        left: `${Math.min(Math.max(16, left - 12), window.innerWidth - dialogWidth - 16)}px`,
      });
    } /* else if (window.innerWidth > 640 && this.data.step === 4) {
      this.dialogRef.updatePosition({
        top: `${Math.max(16, top + (bottom - top - 160) / 2)}px`,
        left: `${Math.max(16, left - dialogWidth - 16)}px`,
      });
    } else if (window.innerWidth > 640 && this.data.step === 5) {
      this.dialogRef.updatePosition({
        top: `${Math.max(16, top + (bottom - top - 160) / 2)}px`,
        left: `${Math.max(16, Math.min(right + 20, window.innerWidth - dialogWidth - 16))}px`,
      });
    } else if (window.innerWidth > 640) {
      this.dialogRef.updatePosition({
        top: `${Math.max(16, top + (bottom - top - 160) / 2)}px`,
        left: `${Math.max(16, left - dialogWidth - 16)}px`,
      });
    } */
  }
}
