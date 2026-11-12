import { Component, HostListener, OnDestroy, OnInit, output } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DocumentChat, ChatMessage } from './document-chat/document-chat';
import { ModalCargaDocs } from './modal-carga-docs/modal-carga-docs';
import { ModalVistaPrevia } from './modal-vista-previa/modal-vista-previa';

interface DocumentItem {
  name: string;
  selectedFileName: string | null;
  selectedFile?: File | null;
  fileBase64?: string | null;
  previewError?: string | null;
  status: 'En revisión' | 'Pendiente';
  uploadState: 'idle' | 'uploading' | 'uploaded';
  uploadProgress: number;
  fileSize: number;
  requiresSignature: boolean;
  messages: ChatMessage[];
}

@Component({
  imports: [DocumentChat, MatDialogModule],
  selector: 'app-documentacion',
  styleUrl: './documentacion.scss',
  templateUrl: './documentacion.html',
})
export class Documentacion implements OnDestroy, OnInit {
  readonly completionPercentageChange = output<number>();

  protected activeChatDocument: DocumentItem | null = null;
  private nextMessageId = 4;

  readonly documents: DocumentItem[] = [
    {
      name: 'Estados financieros parciales',
      selectedFileName: null,
      status: 'Pendiente',
      uploadState: 'idle',
      uploadProgress: 0,
      fileSize: 0,
      requiresSignature: true,
      messages: this.createInitialMessages(),
    },
    {
      name: 'Identificación oficial',
      selectedFileName: 'identificacion_oficial.pdf',
      status: 'En revisión',
      uploadState: 'uploaded',
      uploadProgress: 100,
      fileSize: 8 * 1024 * 1024,
      requiresSignature: true,
      messages: this.createInitialMessages(),
    },
    {
      name: 'Estados financieros anualito último cierre',
      selectedFileName: null,
      status: 'Pendiente',
      uploadState: 'idle',
      uploadProgress: 0,
      fileSize: 0,
      requiresSignature: false,
      messages: this.createInitialMessages(),
    },
    {
      name: 'Estados financieros anualito penúltimo cierre',
      selectedFileName: null,
      status: 'Pendiente',
      uploadState: 'idle',
      uploadProgress: 0,
      fileSize: 0,
      requiresSignature: true,
      messages: this.createInitialMessages(),
    },
    {
      name: 'Declaraciones de impuestos',
      selectedFileName: null,
      status: 'Pendiente',
      uploadState: 'idle',
      uploadProgress: 0,
      fileSize: 0,
      requiresSignature: false,
      messages: this.createInitialMessages(),
    },
    {
      name: 'Relación analítica de las principales cuentas analíticas de las principales cuentas',
      selectedFileName: null,
      status: 'Pendiente',
      uploadState: 'idle',
      uploadProgress: 0,
      fileSize: 0,
      requiresSignature: true,
      messages: this.createInitialMessages(),
    },
    {
      name: 'Estados financieros año de filiales',
      selectedFileName: null,
      status: 'Pendiente',
      uploadState: 'idle',
      uploadProgress: 0,
      fileSize: 0,
      requiresSignature: false,
      messages: this.createInitialMessages(),
    },
    {
      name: 'Pasivos con costo financiero y cuentas de orden',
      selectedFileName: null,
      status: 'Pendiente',
      uploadState: 'idle',
      uploadProgress: 0,
      fileSize: 0,
      requiresSignature: false,
      messages: this.createInitialMessages(),
    },
    {
      name: 'Detalle de pasivos',
      selectedFileName: null,
      status: 'Pendiente',
      uploadState: 'idle',
      uploadProgress: 0,
      fileSize: 0,
      requiresSignature: true,
      messages: this.createInitialMessages(),
    },
    {
      name: 'Descripción de las políticas de otorgamiento de crédito',
      selectedFileName: null,
      status: 'Pendiente',
      uploadState: 'idle',
      uploadProgress: 0,
      fileSize: 0,
      requiresSignature: false,
      messages: this.createInitialMessages(),
    },
  ];

  private readonly uploadTimers = new Map<DocumentItem, ReturnType<typeof setInterval>>();

  constructor(private readonly dialog: MatDialog) {}

  get completionPercentage(): number {
    const completedDocuments = this.documents.filter(
      (document) => document.uploadState === 'uploaded',
    ).length;

    return Math.round((completedDocuments / this.documents.length) * 100);
  }

  ngOnInit(): void {
    this.emitCompletionPercentage();
  }

  ngOnDestroy(): void {
    this.uploadTimers.forEach((timer) => clearInterval(timer));
    this.uploadTimers.clear();
  }

  protected openChat(document: DocumentItem): void {
    this.activeChatDocument = document;
  }

  protected closeChat(): void {
    this.activeChatDocument = null;
  }

  protected sendChatMessage(document: DocumentItem, text: string): void {
    const message = text.trim();
    if (!message) {
      return;
    }

    document.messages.push({
      id: this.nextMessageId++,
      sender: 'client',
      text: message,
      time: this.getCurrentTime(),
      day: 'Hoy',
    });
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    this.closeChat();
  }

  abrirCarga(document: DocumentItem): void {
    this.dialog
      .open(ModalCargaDocs, {
        ariaLabelledBy: 'upload-title',
        backdropClass: 'modal-carga-docs-backdrop',
        data: { documentName: document.name },
        maxWidth: 'calc(100vw - 32px)',
        panelClass: 'modal-carga-docs',
        width: '360px',
      })
      .afterClosed()
      .subscribe((file: File | undefined) => {
        if (file) {
          document.selectedFileName = file.name;
          document.selectedFile = file;
          document.fileBase64 = null;
          document.previewError = null;
          document.fileSize = file.size;
          document.uploadProgress = 0;
          document.uploadState = 'uploading';
          document.status = 'Pendiente';
          this.startUploadProgress(document);
          this.fileToBase64(file)
            .then((fileBase64) => {
              if (document.selectedFile === file) {
                document.fileBase64 = fileBase64;
              }
            })
            .catch(() => {
              if (document.selectedFile === file) {
                document.previewError = 'No fue posible preparar el archivo para su vista previa.';
              }
            });
        }
      });
  }

  removeFile(document: DocumentItem): void {
    const timer = this.uploadTimers.get(document);
    if (timer) {
      clearInterval(timer);
      this.uploadTimers.delete(document);
    }

    document.selectedFileName = null;
    document.selectedFile = null;
    document.fileBase64 = null;
    document.previewError = null;
    document.fileSize = 0;
    document.uploadProgress = 0;
    document.uploadState = 'idle';
    document.status = 'Pendiente';
    this.emitCompletionPercentage();
  }

  verArchivo(document: DocumentItem): void {
    if (!document.selectedFileName) {
      return;
    }

    this.dialog.open(ModalVistaPrevia, {
      ariaLabelledBy: 'preview-title',
      backdropClass: 'modal-vista-previa-backdrop',
      data: {
        documentName: document.name,
        fileBase64: document.fileBase64 ?? null,
        fileName: document.selectedFileName,
        previewError: document.previewError ?? null,
      },
      height: 'min(680px, calc(100vh - 48px))',
      maxHeight: 'calc(100vh - 32px)',
      maxWidth: 'calc(100vw - 32px)',
      panelClass: 'modal-vista-previa',
      width: '760px',
    });
  }

  formatFileSize(bytes: number): string {
    if (bytes < 1024 * 1024) {
      return `${Math.max(1, Math.round(bytes / 1024))} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  getUploadedSize(document: DocumentItem): string {
    return this.formatFileSize((document.fileSize * document.uploadProgress) / 100);
  }

  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result !== 'string') {
          reject(new Error('El archivo no se pudo convertir a Base64.'));
          return;
        }

        const base64 = reader.result.split(',')[1];
        if (!base64) {
          reject(new Error('El archivo no produjo contenido Base64.'));
          return;
        }

        resolve(base64);
      };
      reader.onerror = () => reject(reader.error ?? new Error('No se pudo leer el archivo.'));
      reader.readAsDataURL(file);
    });
  }

  private startUploadProgress(document: DocumentItem): void {
    const previousTimer = this.uploadTimers.get(document);
    if (previousTimer) {
      clearInterval(previousTimer);
    }

    const timer = setInterval(() => {
      document.uploadProgress = Math.min(document.uploadProgress + 5, 100);

      if (document.uploadProgress === 100) {
        clearInterval(timer);
        this.uploadTimers.delete(document);
        document.uploadState = 'uploaded';
        document.status = 'En revisión';
        this.emitCompletionPercentage();
      }
    }, 100);

    this.uploadTimers.set(document, timer);
  }

  private emitCompletionPercentage(): void {
    this.completionPercentageChange.emit(this.completionPercentage);
  }

  private createInitialMessages(): ChatMessage[] {
    return [
      {
        id: 1,
        sender: 'executive',
        text: 'Hola, podemos revisar cualquier duda o comentario sobre este documento.',
        time: '10:24',
        day: 'Hace 2 días',
      },
      {
        id: 2,
        sender: 'client',
        text: 'Hola Carlos, buen día.',
        time: '10:26',
        day: 'Hoy',
      },
      {
        id: 3,
        sender: 'client',
        text: 'Te compartiré mis comentarios por aquí.',
        time: '10:27',
        day: 'Hoy',
      },
    ];
  }

  private getCurrentTime(): string {
    return new Intl.DateTimeFormat('es-MX', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date());
  }
}
