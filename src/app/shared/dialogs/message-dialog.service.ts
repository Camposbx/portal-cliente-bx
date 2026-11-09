import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { map, Observable } from 'rxjs';
import { MessageDialog, MessageDialogData } from './message-dialog/message-dialog';

@Injectable({ providedIn: 'root' })
export class MessageDialogService {
  private readonly dialog = inject(MatDialog);

  open(data: MessageDialogData): Observable<boolean> {
    return this.dialog
      .open<MessageDialog, MessageDialogData, boolean>(MessageDialog, {
        ariaLabelledBy: 'message-dialog-title',
        ariaDescribedBy: 'message-dialog-description',
        backdropClass: 'message-dialog-backdrop',
        data,
        maxWidth: 'calc(100vw - 32px)',
        panelClass: 'message-dialog-panel',
        width: '460px',
      })
      .afterClosed()
      .pipe(map((accepted) => accepted === true));
  }
}
