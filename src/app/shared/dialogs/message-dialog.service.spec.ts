import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { MessageDialogService } from './message-dialog.service';
import { MessageDialog } from './message-dialog/message-dialog';

describe('MessageDialogService', () => {
  it('opens the generic dialog with the supplied content and returns acceptance', async () => {
    const afterClosed = vi.fn(() => of(true));
    const open = vi.fn(() => ({ afterClosed }));
    
    await TestBed.configureTestingModule({
      providers: [
        MessageDialogService,
        { provide: MatDialog, useValue: { open } },
      ],
    }).compileComponents();

    const service = TestBed.inject(MessageDialogService);
    const data = {
      type: 'question' as const,
      title: '¿Eliminar este teléfono?',
      message: 'Podrás volver a agregarlo cuando quieras.',
      confirmText: 'Eliminar teléfono',
      cancelText: 'Cancelar',
    };

    let accepted: boolean | undefined;
    service.open(data).subscribe((result) => (accepted = result));

    expect(open).toHaveBeenCalledWith(
      MessageDialog,
      expect.objectContaining({ data, width: '460px' }),
    );
    expect(accepted).toBe(true);
  });

  it('returns false when the dialog is dismissed without accepting', async () => {
    const open = vi.fn(() => ({ afterClosed: () => of(undefined) }));
    await TestBed.configureTestingModule({
      providers: [
        MessageDialogService,
        { provide: MatDialog, useValue: { open } },
      ],
    }).compileComponents();
    const service = TestBed.inject(MessageDialogService);

    let accepted: boolean | undefined;
    service.open({ type: 'info', title: 'Aviso', message: 'Mensaje' })
      .subscribe((result) => (accepted = result));

    expect(accepted).toBe(false);
  });
});
