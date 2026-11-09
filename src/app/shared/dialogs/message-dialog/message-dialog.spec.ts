import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MessageDialog, MessageDialogData } from './message-dialog';

describe('MessageDialog', () => {
  let fixture: ComponentFixture<MessageDialog>;
  let dialogRef: { close: ReturnType<typeof vi.fn> };

  async function render(data: MessageDialogData): Promise<void> {
    dialogRef = { close: vi.fn() };
    await TestBed.configureTestingModule({
      imports: [MessageDialog],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: data },
        { provide: MatDialogRef, useValue: dialogRef },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(MessageDialog);
    fixture.detectChanges();
  }

  it('shows configured question text and returns true for acceptance', async () => {
    await render({
      type: 'question',
      title: '¿Eliminar este teléfono?',
      message: 'Podrás volver a agregarlo cuando quieras.',
      confirmText: 'Eliminar teléfono',
      cancelText: 'Cancelar',
    });

    const element = fixture.nativeElement as HTMLElement;
    expect(element.textContent).toContain('¿Eliminar este teléfono?');
    expect(element.textContent).toContain('Podrás volver a agregarlo cuando quieras.');
    expect(element.querySelectorAll('.message-dialog__button')).toHaveLength(2);
    element.querySelector<HTMLButtonElement>('.message-dialog__button--confirm')?.click();
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });

  it('shows a single acknowledgement button for a success message', async () => {
    await render({
      type: 'success',
      title: 'Invitación enviada',
      message: 'La invitación está pendiente.',
      confirmText: 'Entendido',
    });

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelectorAll('.message-dialog__button')).toHaveLength(1);
    expect(element.querySelector('.message-dialog__button--confirm')?.textContent?.trim())
      .toBe('Entendido');
    element.querySelector<HTMLButtonElement>('.message-dialog__close')?.click();
    expect(dialogRef.close).toHaveBeenCalledWith(false);
  });
});
